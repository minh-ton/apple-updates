module.exports = {
    PALLAS_CONFIGS: {
        macos: [
            {
                enabled: false,
                is_beta: false,
                target_version: 11,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '11.7.8',
                    build: '20G1351',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 11 Release',
                asset_audience: '60b55e25-a8ed-4f45-826c-c1495a4ccc65'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 11,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '11.7.8',
                    build: '20G1351',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 11 Dev Beta',
                asset_audience: 'ca60afc6-5954-46fd-8cb9-60dde6ac39fd'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 12,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '12.7.4',
                    build: '21H1123',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 12 Release',
                asset_audience: '60b55e25-a8ed-4f45-826c-c1495a4ccc65'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 12,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '12.7.4',
                    build: '21H1123',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 12 Dev Beta',
                asset_audience: '298e518d-b45e-4d36-94be-34a63d6777ec'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 13,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '13.7.6',
                    build: '22H625',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 13 Release',
                asset_audience: '60b55e25-a8ed-4f45-826c-c1495a4ccc65'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 13,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '13.7.6',
                    build: '22H625',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 13 Dev Beta',
                asset_audience: '683e9586-8a82-4e5f-b0e7-767541864b8b'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 14,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '14.7.8',
                    build: '23H730',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 14 Release',
                asset_audience: '60b55e25-a8ed-4f45-826c-c1495a4ccc65'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 14,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '14.7.8',
                    build: '23H730',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 14 Dev Beta',
                asset_audience: '77c3bd36-d384-44e8-b550-05122d7da438'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 15,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '15.7',
                    build: '24G222',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 15 Release',
                asset_audience: '60b55e25-a8ed-4f45-826c-c1495a4ccc65'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 15,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '15.7',
                    build: '24G222',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 15 Dev Beta',
                asset_audience: '98df7800-8378-4469-93bf-5912da21a1e1'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 16,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '26.0.1',
                    build: '25A362',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 26 Release',
                asset_audience: '60b55e25-a8ed-4f45-826c-c1495a4ccc65'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 16,
                device: {
                    // M1 Pro MacBook Pro (14")
                    version: '26.0.1',
                    build: '25A362',
                    prodtype: 'MacBookPro18,3',
                    model: 'J314sAP'
                },
                description: 'macOS 26 Dev Beta',
                asset_audience: '832afda4-7283-41da-a95b-75f4a151e473'
            }
        ],

        ios: [
            {
                enabled: true,
                is_beta: false,
                target_version: 12,
                device: {
                    // iPhone 6+
                    version: '12.5.6',
                    build: '16H71',
                    prodtype: 'iPhone7,1',
                    model: 'N56AP'
                },
                description: 'iOS 12 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 12,
                device: {
                    // iPhone 6+
                    version: '12.5.6',
                    build: '16H71',
                    prodtype: 'iPhone7,1',
                    model: 'N56AP'
                },
                description: 'iOS 12 Dev Beta',
                asset_audience: 'ef473147-b8e7-4004-988e-0ae20e2532ef'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 15,
                device: {
                    // iPhone 7
                    version: '15.6',
                    build: '19G71',
                    prodtype: 'iPhone9,3',
                    model: 'D101AP'
                },
                description: 'iOS 15 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 15,
                device: {
                    // iPhone 7
                    version: '15.6',
                    build: '19G71',
                    prodtype: 'iPhone9,3',
                    model: 'D101AP'
                },
                description: 'iOS 15 Dev Beta',
                asset_audience: 'ce48f60c-f590-4157-a96f-41179ca08278'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 16,
                device: {
                    // iPhone X
                    version: '16.6',
                    build: '20G75',
                    prodtype: 'iPhone10,6',
                    model: 'D221AP'
                },
                description: 'iOS 16 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 16,
                device: {
                    version: '16.6',
                    build: '20G75',
                    prodtype: 'iPhone10,6',
                    model: 'D221AP'
                },
                description: 'iOS 16 Dev Beta',
                asset_audience: 'a6050bca-50d8-4e45-adc2-f7333396a42c'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 17,
                device: {
                    // iPhone XR
                    version: '17.5.1',
                    build: '21F91',
                    prodtype: 'iPhone11,8',
                    model: 'N841AP'
                },
                description: 'iOS 17 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 17,
                device: {
                    version: '17.5.1',
                    build: '21F91',
                    prodtype: 'iPhone11,8',
                    model: 'N841AP'
                },
                description: 'iOS 17 Dev Beta',
                asset_audience: '9dcdaf87-801d-42f6-8ec6-307bd2ab9955'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 18,
                device: {
                    // iPhone XR
                    version: '18.5',
                    build: '22F76',
                    prodtype: 'iPhone11,8',
                    model: 'N841AP'
                },
                description: 'iOS 18 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 18,
                device: {
                    // iPhone XR
                    version: '18.5',
                    build: '22F76',
                    prodtype: 'iPhone11,8',
                    model: 'N841AP'
                },
                description: 'iOS 18 Dev Beta',
                asset_audience: '41651cee-d0e2-442f-b786-85682ff6db86'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 26,
                // iPhone 11
                device: {
                    version: '26.0.1',
                    build: '23A355',
                    prodtype: 'iPhone12,1',
                    model: 'N104AP'
                },
                description: 'iOS 26 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 26,
                device: {
                    version: '26.0.1',
                    build: '23A355',
                    prodtype: 'iPhone12,1',
                    model: 'N104AP'
                },
                description: 'iOS 26 Dev Beta',
                asset_audience: 'da1941f6-9822-4347-b771-fb09c3509052'
            }
        ],

        ipados: [
            {
                enabled: true,
                is_beta: false,
                target_version: 15,
                device: {
                    // iPad Mini 4
                    version: '15.6',
                    build: '19G71',
                    prodtype: 'iPad5,1',
                    model: 'J96AP'
                },
                description: 'iPadOS 15 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 15,
                device: {
                    // iPad Mini 4
                    version: '15.6',
                    build: '19G71',
                    prodtype: 'iPad5,1',
                    model: 'J96AP'
                },
                description: 'iPadOS 15 Dev Beta',
                asset_audience: 'ce48f60c-f590-4157-a96f-41179ca08278'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 16,
                device: {
                    // iPad 5th Gen
                    version: '16.6',
                    build: '20G75',
                    prodtype: 'iPad6,12',
                    model: 'J72tAP'
                },
                description: 'iPadOS 16 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 16,
                device: {
                    // iPad 5th Gen
                    version: '16.6',
                    build: '20G75',
                    prodtype: 'iPad6,12',
                    model: 'J72tAP'
                },
                description: 'iPadOS 16 Dev Beta',
                asset_audience: 'a6050bca-50d8-4e45-adc2-f7333396a42c'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 17,
                device: {
                    // iPad 6th Gen
                    version: '17.5.1',
                    build: '21F91',
                    prodtype: 'iPad7,6',
                    model: 'J72bAP'
                },
                description: 'iPadOS 17 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 17,
                device: {
                    // iPad 6th Gen
                    version: '17.5.1',
                    build: '21F91',
                    prodtype: 'iPad7,6',
                    model: 'J72bAP'
                },
                description: 'iPadOS 17 Dev Beta',
                asset_audience: '9dcdaf87-801d-42f6-8ec6-307bd2ab9955'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 18,
                device: {
                    // iPad 7th Gen
                    version: '18.5',
                    build: '22F76',
                    prodtype: 'iPad7,12',
                    model: 'J172AP'
                },
                description: 'iPadOS 18 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 18,
                device: {
                    // iPad 7th Gen
                    version: '18.5',
                    build: '22F76',
                    prodtype: 'iPad7,12',
                    model: 'J172AP'
                },
                description: 'iPadOS 18 Dev Beta',
                asset_audience: '41651cee-d0e2-442f-b786-85682ff6db86'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 26,
                device: {
                    // iPad Pro 7
                    version: '26.0.1',
                    build: '23A355',
                    prodtype: 'iPad16,5',
                    model: 'J720AP'
                },
                description: 'iPadOS 26 Release',
                asset_audience: '01c1d682-6e8f-4908-b724-5501fe3f5e5c'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 26,
                device: {
                    // iPad Pro 7
                    version: '26.0.1',
                    build: '23A355',
                    prodtype: 'iPad16,5',
                    model: 'J720AP'
                },
                description: 'iPadOS 26 Dev Beta',
                asset_audience: 'da1941f6-9822-4347-b771-fb09c3509052'
            }
        ],

        watchos: [
            {
                enabled: false,
                is_beta: false,
                target_version: 8,
                device: {
                    // Apple Watch Series 7
                    version: '8.6',
                    build: '19T572',
                    prodtype: 'Watch6,9',
                    model: 'N188bAP'
                },
                description: 'watchOS 8 Release',
                asset_audience: 'b82fcf9c-c284-41c9-8eb2-e69bf5a5269f'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 8,
                device: {
                    // Apple Watch Series 7
                    version: '8.6',
                    build: '19T572',
                    prodtype: 'Watch6,9',
                    model: 'N188bAP'
                },
                description: 'watchOS 8 Dev Beta',
                asset_audience: 'b407c130-d8af-42fc-ad7a-171efea5a3d0'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 9,
                device: {
                    // Apple Watch Ultra 1
                    version: '9.5.2',
                    build: '20T571',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 9 Release',
                asset_audience: 'b82fcf9c-c284-41c9-8eb2-e69bf5a5269f'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 9,
                device: {
                    // Apple Watch Ultra 1
                    version: '9.5.2',
                    build: '20T571',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 9 Dev Beta',
                asset_audience: '341f2a17-0024-46cd-968d-b4444ec3699f'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 10,
                device: {
                    // Apple Watch Ultra 1
                    version: '10.5',
                    build: '21T576',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 10 Release',
                asset_audience: 'b82fcf9c-c284-41c9-8eb2-e69bf5a5269f'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 10,
                device: {
                    // Apple Watch Ultra 1
                    version: '10.5',
                    build: '21T576',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 10 Dev Beta',
                asset_audience: '7ae7f3b9-886a-437f-9b22-e9f017431b0e'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 11,
                device: {
                    // Apple Watch Ultra 1
                    version: '11.5',
                    build: '22T572',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 11 Release',
                asset_audience: 'b82fcf9c-c284-41c9-8eb2-e69bf5a5269f'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 11,
                device: {
                    // Apple Watch Ultra 1
                    version: '11.5',
                    build: '22T572',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 11 Dev Beta',
                asset_audience: '23d7265b-1000-47cf-8d0a-07144942db9e'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 26,
                device: {
                    // Apple Watch Ultra 1
                    version: '26.0.1',
                    build: '23R8352',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 26 Release',
                asset_audience: 'b82fcf9c-c284-41c9-8eb2-e69bf5a5269f'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 26,
                device: {
                    // Apple Watch Ultra 1
                    version: '26.0.1',
                    build: '23R8352',
                    prodtype: 'Watch6,18',
                    model: 'N199AP'
                },
                description: 'watchOS 26 Dev Beta',
                asset_audience: 'e73d2741-8003-45cd-b909-86b9840f2ea2'
            }
        ],

        audioos: [
            {
                enabled: false,
                is_beta: false,
                target_version: 15,
                device: {
                    // HomePod Mini
                    version: '15.5.1',
                    build: '19L580',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 15 Release',
                asset_audience: '0322d49d-d558-4ddf-bdff-c0443d0e6fac'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 15,
                device: {
                    // HomePod Mini
                    version: '15.5.1',
                    build: '19L580',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 15 Dev Beta',
                asset_audience: '58ff8d56-1d77-4473-ba88-ee1690475e40'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 16,
                device: {
                    // HomePod Mini
                    version: '16.5',
                    build: '20L563',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 16 Release',
                asset_audience: '0322d49d-d558-4ddf-bdff-c0443d0e6fac'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 16,
                device: {
                    // HomePod Mini
                    version: '16.5',
                    build: '20L563',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 16 Dev Beta',
                asset_audience: '59377047-7b3f-45b9-8e99-294c0daf3c85'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 17,
                device: {
                    // HomePod Mini
                    version: '17.5',
                    build: '21L569',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 17 Release',
                asset_audience: '0322d49d-d558-4ddf-bdff-c0443d0e6fac'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 17,
                device: {
                    // HomePod Mini
                    version: '17.5',
                    build: '21L569',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 17 Dev Beta',
                asset_audience: '17536d4c-1a9d-4169-bc62-920a3873f7a5'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 18,
                device: {
                    // HomePod Mini
                    version: '18.5',
                    build: '22L572',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 18 Release',
                asset_audience: '0322d49d-d558-4ddf-bdff-c0443d0e6fac'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 18,
                device: {
                    // HomePod Mini
                    version: '18.5',
                    build: '22L572',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 18 Dev Beta',
                asset_audience: 'bedbd9c7-738a-4060-958b-79da54a1f7ad'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 26,
                device: {
                    // HomePod Mini
                    version: '26.0.1',
                    build: '23J362',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 26 Release',
                asset_audience: '0322d49d-d558-4ddf-bdff-c0443d0e6fac'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 26,
                device: {
                    // HomePod Mini
                    version: '26.0.1',
                    build: '23J362',
                    prodtype: 'AudioAccessory5,1',
                    model: 'B520AP'
                },
                description: 'audioOS 26 Dev Beta',
                asset_audience: '47ed08e9-bd89-454e-938c-664029863ee8'
            }
        ],

        tvos: [
            {
                enabled: false,
                is_beta: false,
                target_version: 15,
                device: {
                    // Apple TV 4K (2nd generation)
                    version: '15.5.1',
                    build: '19L580',
                    prodtype: 'AppleTV11,1',
                    model: 'J305AP'
                },
                description: 'tvOS 15 Release',
                asset_audience: '356d9da0-eee4-4c6c-bbe5-99b60eadddf0'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 15,
                device: {
                    // Apple TV 4K (2nd generation)
                    version: '15.5.1',
                    build: '19L580',
                    prodtype: 'AppleTV11,1',
                    model: 'J305AP'
                },
                description: 'tvOS 15 Dev Beta',
                asset_audience: '4d0dcdf7-12f2-4ebf-9672-ac4a4459a8bc'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 16,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '16.5',
                    build: '20L563',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 16 Release',
                asset_audience: '356d9da0-eee4-4c6c-bbe5-99b60eadddf0'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 16,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '16.5',
                    build: '20L563',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 16 Dev Beta',
                asset_audience: 'd6bac98b-9e2a-4f87-9aba-22c898b25d84'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 17,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '17.5.1',
                    build: '21L580',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 17 Release',
                asset_audience: '356d9da0-eee4-4c6c-bbe5-99b60eadddf0'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 17,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '17.5.1',
                    build: '21L580',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 17 Dev Beta',
                asset_audience: '61693fed-ab18-49f3-8983-7c3adf843913'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 18,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '18.5',
                    build: '22L572',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 18 Release',
                asset_audience: '356d9da0-eee4-4c6c-bbe5-99b60eadddf0'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 18,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '18.5',
                    build: '22L572',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 18 Dev Beta',
                asset_audience: '98847ed4-1c37-445c-9e7b-5b95d29281f2'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 26,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '26.0.1',
                    build: '23J362',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 26 Release',
                asset_audience: '356d9da0-eee4-4c6c-bbe5-99b60eadddf0'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 26,
                device: {
                    // Apple TV 4K (3rd generation)
                    version: '26.0.1',
                    build: '23J362',
                    prodtype: 'AppleTV14,1',
                    model: 'J255AP'
                },
                description: 'tvOS 26 Dev Beta',
                asset_audience: '69cc7bd5-9ff2-4f5e-8b4f-30955542a81d'
            }
        ],

        visionos: [
            {
                enabled: false,
                is_beta: false,
                target_version: 1,
                device: {
                    // Apple Vision Pro
                    version: '1.2',
                    build: '21O589',
                    prodtype: 'RealityDevice14,1',
                    model: 'N301AP'
                },
                description: 'visionOS 1 Release',
                asset_audience: 'c59ff9d1-5468-4f6c-9e54-f68d5eeab93b'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 1,
                device: {
                    // Apple Vision Pro
                    version: '1.2',
                    build: '21O589',
                    prodtype: 'RealityDevice14,1',
                    model: 'N301AP'
                },
                description: 'visionOS 1 Dev Beta',
                asset_audience: '4d282764-95fe-4e0e-b7da-ea218fd1f75a'
            },
            {
                enabled: false,
                is_beta: false,
                target_version: 2,
                device: {
                    // Apple Vision Pro
                    version: '2.5',
                    build: '22O473',
                    prodtype: 'RealityDevice14,1',
                    model: 'N301AP'
                },
                description: 'visionOS 2 Release',
                asset_audience: 'c59ff9d1-5468-4f6c-9e54-f68d5eeab93b'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 2,
                device: {
                    // Apple Vision Pro
                    version: '2.5',
                    build: '22O473',
                    prodtype: 'RealityDevice14,1',
                    model: 'N301AP'
                },
                description: 'visionOS 2 Dev Beta',
                asset_audience: '0bef3239-79ad-4d2a-99c3-2c05df2becf8'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 26,
                device: {
                    // Apple Vision Pro
                    version: '26.0.1',
                    build: '23M341',
                    prodtype: 'RealityDevice14,1',
                    model: 'N301AP'
                },
                description: 'visionOS 26 Release',
                asset_audience: 'c59ff9d1-5468-4f6c-9e54-f68d5eeab93b'
            },
            {
                enabled: true,
                is_beta: true,
                target_version: 26,
                device: {
                    // Apple Vision Pro
                    version: '26.0.1',
                    build: '23M341',
                    prodtype: 'RealityDevice14,1',
                    model: 'N301AP'
                },
                description: 'visionOS 26 Dev Beta',
                asset_audience: '6cc62786-ab10-4911-bbc3-ebb7815972f6'
            }
        ]
    },

    SUCATALOG_CONFIGS: {
        macos: [
            {
                enabled: true,
                is_beta: true,
                target_version: 26,
                description: 'macOS Beta',
                catalog_url: 'https://swscan.apple.com/content/catalogs/others/index-26seed-26-15-14-13-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog.gz'
            },
            {
                enabled: true,
                is_beta: false,
                target_version: 26,
                description: 'macOS Public',
                catalog_url: 'https://swscan.apple.com/content/catalogs/others/index-26-15-14-13-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 15,
                description: 'macOS 15 Beta',
                catalog_url: 'https://swscan.apple.com/content/catalogs/others/index-15seed-15-14-13-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 14,
                description: 'macOS 14 Beta',
                catalog_url: 'https://swscan.apple.com/content/catalogs/others/index-14seed-14-13-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 13,
                description: 'macOS 13 Beta',
                catalog_url: 'https://swscan.apple.com/content/catalogs/others/index-13seed-13-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 12,
                description: 'macOS 12 Beta',
                catalog_url: 'https://swscan.apple.com/content/catalogs/others/index-12seed-12-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog'
            },
            {
                enabled: false,
                is_beta: true,
                target_version: 11,
                description: 'macOS 11 Beta',
                catalog_url: 'https://swscan.apple.com/content/catalogs/others/index-10.16seed-10.16-10.15-10.14-10.13-10.12-10.11-10.10-10.9-mountainlion-lion-snowleopard-leopard.merged-1.sucatalog'
            }
        ]
    },

    ASSET_TYPES: {
        ios: "com.apple.MobileAsset.SoftwareUpdate",
        ipados: "com.apple.MobileAsset.SoftwareUpdate",
        audioos: "com.apple.MobileAsset.SoftwareUpdate",
        macos: "com.apple.MobileAsset.MacSoftwareUpdate",
        watchos: "com.apple.MobileAsset.SoftwareUpdate",
        tvos: "com.apple.MobileAsset.SoftwareUpdate",
        visionos: "com.apple.MobileAsset.SoftwareUpdate",
    },

    DOCUMENTATION_ASSET_TYPES: {
        ios: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
        ipados: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
        audioos: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
        macos: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
        watchos: "com.apple.MobileAsset.WatchSoftwareUpdateDocumentation",
        visionos: "com.apple.MobileAsset.SoftwareUpdateDocumentation",
    },

    DEVICE_NAMES: {
        ios: "iPhone",
        ipados: "iPad",
        audioos: "AudioAccessory",
        watchos: "Watch",
        macos: "Mac",
        visionos: "RealityDevice",
    }
}
