#!/bin/bash

print_universal() {
    date=$(date +%a\ %d\ %b\ %Y)
    echo "Current Date:" $date
    time=$(date +%I:%M:%S\ %p\ %Z)
    timezone=$(date +%Z)
    ampm=$( echo "$time" | grep -qi 'PM' && echo PM || echo AM )
    
    if  [[ $ampm == PM ]]; then
        time=$(date +%I:%M | sed "s/$/ PM ${timezone}/")
    else
        time=$(date +%I:%M:%S | sed "s/$/ AM ${timezone}/")
    fi
    
    echo "Current Time: $time"
    uptime=$(uptime | sed -E 's/^[^,]*up *//; s/mins/minutes/; s/hrs?/hours/; s/([[:digit:]]+):0?([[:digit:]]+)/\1 hours, \2 minutes/; s/^1 hours/1 hour/; s/ 1 hours/ 1 hour/; s/min,/minutes,/; s/ 0 minutes,/ less than a minute,/; s/ 1 minutes/ 1 minute/; s/  / /; s/, *[[:digit:]]* users?.*//')
    echo "Uptime: $uptime"
}

print_linux() {
    # Print OS image
    ###################################
    echo "$USER"@"$( cat /proc/sys/kernel/hostname | cut -f 1 -d .)"' ~ % hedgefetch'
    echo "##       #### ##    ## ##     ## ##     ##"
    echo "##        ##  ###   ## ##     ##  ##   ##"
    echo "##        ##  ####  ## ##     ##   ## ##"
    echo "##        ##  ## ## ## ##     ##    ###"
    echo "##        ##  ##  #### ##     ##   ## ##"
    echo "##        ##  ##   ### ##     ##  ##   ##"
    printf "######## #### ##    ##  #######  ##     ##\n\n"
    
    # Print universal
    ###################################
    print_universal
    
    # Linux Version
    ###################################
    lsb_release -a 2>/dev/null | grep "Description" | cut -f2 -d ':' | cut -c 2- | sed 's/^/OS: /g'
    
    # Kernel Version
    ###################################
    uname -r | cut -f1,2 -d '-' | sed 's/^/Kernel: /'
    
    # CPU
    ###################################
    cat /proc/cpuinfo | grep "model name" | head -n 1 | cut -f2 -d ":" | cut -c 1- | sed 's/           / /;s/([^)]*)//g;s/CPU //;s/  / /' | sed 's/^/CPU:/'
    
    # RAM garbage
    ###################################
    kb=$( cat /proc/meminfo | grep MemTotal | cut -f2 -d ':' | cut -c 8- | cut -f1 -d ' ')
    MB=$(( $kb / 1024 ))
    GB=$(( $kb / 1000/1000 ))
    FreeMem=$( cat /proc/meminfo | grep MemFree | cut -f2 -d ':' | cut -c 8- | cut -f1 -d 'k' )
    #UsedMem=$(top -l 1 | grep PhysMem | cut -c 10-  | cut -d ' ' -f -1 | sed 's/.$//')
    FreeMem=$(( $FreeMem / 1000 ))
    UsedMem=$(( $MB - $FreeMem ))
    UsedGB=$(( $UsedMem / 1000 ))
    MB=$( echo $MB | sed 's/$/MB/')
    echo "$UsedMem" | sed "s/$/MB ("$UsedGB"GB) of $MB ("$GB"GB) Used/"
    
    ###################################
}


main() {
    print_linux
}

# Run main
main