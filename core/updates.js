// Fetch updates for each Apple OS

const { PALLAS_CONFIGS, SUCATALOG_CONFIGS } = require("./constants.js");

require('./fetch/fetch.js')();
require('./utils/error.js')();

// ============= POLLING CONFIGURATION =============
// Here, my idea is to implement a polling mechanism which
// adjusts the polling frequency based on the OS version's
// priority (latest versions get polled more frequently).
// Additionally, during known Apple release windows, all
// versions are polled more frequently to catch updates
// as soon as possible.

// The reason for this is that I'm hosting this Discord bot
// on the limited e2-micro Google Cloud instance (lol) and have
// been seeing excessive resource usage in the last couple of 
// years which caused a lot of problems. Now that I'm going to
// add more OSes to monitor, I need to optimize the polling to 
// be more efficient.

// I used GitHub Copilot to help me with writing this part.
// Although this is the best result I could get, I still feel
// that the code could be improved further in the future.

const POLLING_INTERVALS = {
    latest: 60000,           // 1 minute for latest versions
    base: 120000,            // 2 minutes base for older versions
    maxInterval: 1800000,    // 30 minutes max interval for very old versions
    installer: 300000,       // 5 minutes for installers
    stagger: 5000            // 5 seconds stagger between configs
};

// I noticed that Apple tends to release updates at
// around 0 AM UTC+7, so I just use a release window of
// ± 1-2 hours around that time to poll more frequently.

// I really want the code to look clean, but at the same
// time I don't want to deal with timezones as well, so
// UTC+7 is used here directly.

const RELEASE_WINDOW_START = 23;
const RELEASE_WINDOW_END = 2;

function is_release_window() {
    const utc_hour = new Date().getUTCHours();
    const utc7_hour = (utc_hour + 7) % 24;
    return utc7_hour >= RELEASE_WINDOW_START || utc7_hour <= RELEASE_WINDOW_END;
}

function get_polling_interval(version_index, is_latest) {
    if (is_release_window()) {
        if (is_latest) return POLLING_INTERVALS.latest;
        return Math.min(POLLING_INTERVALS.base * Math.pow(1.5, version_index), POLLING_INTERVALS.installer);
    }
    
    // Exponential backoff
    const interval = POLLING_INTERVALS.base * Math.pow(2, version_index);
    return Math.min(interval, POLLING_INTERVALS.maxInterval);
}

// ============= POLLING FUNCTIONS =============

module.exports = function () {
    this.start_polling = function () {        
        const polling_tasks = [];
        let stagger_delay = 0;

        for (const os_key in PALLAS_CONFIGS) {
            const configs = PALLAS_CONFIGS[os_key];
            
            const enabled_configs = configs.filter(c => c.enabled);
            const release_configs = enabled_configs.filter(c => !c.is_beta).sort((a, b) => (b.target_version || 0) - (a.target_version || 0));
            const beta_configs = enabled_configs.filter(c => c.is_beta).sort((a, b) => (b.target_version || 0) - (a.target_version || 0));
            
            release_configs.forEach((config, index) => {
                polling_tasks.push({
                    os_key: os_key,
                    config: config,
                    is_latest: index === 0,
                    version_index: index,
                    stagger_delay: stagger_delay
                });
                stagger_delay += POLLING_INTERVALS.stagger;
            });
            
            beta_configs.forEach((config, index) => {
                polling_tasks.push({
                    os_key: os_key,
                    config: config,
                    is_latest: index === 0,
                    version_index: index,
                    stagger_delay: stagger_delay
                });
                stagger_delay += POLLING_INTERVALS.stagger;
            });
        }

        polling_tasks.forEach(task => start_pallas_polling(task));
        start_installers_polling();
    };

    function start_pallas_polling(task) {
        const poll = async () => {
            try {
                await check_for_updates(
                    task.os_key,
                    task.config.asset_audience,
                    task.config.device.build,
                    task.config.device.model,
                    task.config.device.prodtype,
                    task.config.device.version,
                    task.config.is_beta,
                    task.config.target_version
                );
            } catch (error) {
                log_error(error, 'updates.js', 'start_pallas_polling', task.config.description);
            }
        };

        const schedule_next = () => {
            const interval = get_polling_interval(task.version_index, task.is_latest);
            setTimeout(async () => {
                await poll();
                schedule_next();
            }, interval);
        };

        setTimeout(async () => {
            await poll();
            schedule_next();
        }, task.stagger_delay);
    }

    function start_installers_polling() {
        const enabled_configs = SUCATALOG_CONFIGS.macos.filter(c => c.enabled);
        if (enabled_configs.length === 0) return;

        enabled_configs.forEach((config, index) => {
            const stagger_delay = index * (POLLING_INTERVALS.installer / 2);
            
            const poll = async () => {
                try {
                    await check_for_installers(config.catalog_url, config.is_beta);
                } catch (error) {
                    log_error(error, 'updates.js', 'start_installers_polling', config.description);
                }
            };

            const schedule_next = () => {
                setTimeout(async () => {
                    await poll();
                    schedule_next();
                }, POLLING_INTERVALS.installer);
            };

            setTimeout(async () => {
                await poll();
                schedule_next();
            }, stagger_delay);
        });
    }

    this.updates_polling = async function () {
        for (const os_key in PALLAS_CONFIGS) {
            const configs = PALLAS_CONFIGS[os_key];
            
            for (const config of configs) {
                if (!config.enabled) continue;

                await check_for_updates(
                    os_key,
                    config.asset_audience,
                    config.device.build,
                    config.device.model,
                    config.device.prodtype,
                    config.device.version,
                    config.is_beta,
                    config.version_target
                );
            }
        }
    };

    this.installers_polling = async function () {
        for (const config of SUCATALOG_CONFIGS.macos) {
            if (!config.enabled) continue;
            await check_for_installers(config.catalog_url, config.is_beta);
        }
    };
}