const version = 'v1.2.0';

function log(ns, hostname, msg) {
    ns.tprint(`${hostname} ${version}: ${msg}`);
}

async function do_the_hacking(ns, hostname) {
    while(true) {
        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(hostname)) {
            await ns.hack(hostname);
            await ns.grow(hostname);
        } else {
            await ns.sleep(10000);
        }
    }
}

function hack_servers(ns, hostname) {
    let scriptName = 'hack.js';
    let servers = ns.scan(hostname);
    servers.forEach(server => {
        if (server == 'home') return;

        // stop all other scripts
        ns.killall(server);

        log(ns, hostname, `Checking server: ${server}`);

        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(server)) {
            // server is hackable
            if (ns.hasRootAccess(server) === false) {
                // run all port hacks
                ns.brutessh(server);
                
                // server has not been hacked
                ns.nuke(server);
                log(ns, hostname, `Nuking server: ${server}`);
            }
        }

        // remove file from server
        ns.rm(scriptName, server);

        // copy this file to server
        let copyOK = ns.scp(scriptName, server);
        if (copyOK) {
            log(ns, hostname, `Copied ${scriptName} to ${server}`);
        } else {
            log(ns, hostname, `Could not copy ${scriptName} to ${server}`);
        }

        if (ns.hasRootAccess(server) === true) {
            // we have root access
            log(ns, hostname, `We have root access to server: ${server}`);
            
            // run this file on server
            let pid = ns.exec(scriptName, server);
            log(ns, hostname, `Started hack on ${server} with PID ${pid}`);

            ns.write('hacked.txt', pid, 'w');
        }
    });
}

export async function main(ns) {
    let hostname = ns.getHostname();

    log(ns, hostname, `My hacking level is ${ns.getHackingLevel()}`);

    let already_done = ns.fileExists('hacked.txt');
    log(ns, hostname, `already_done: ${already_done}`);

    if (already_done && hostname != 'home') {
        await do_the_hacking(ns, hostname);
    } else {
        hack_servers(ns, hostname);

        if (hostname != 'home') {
            await do_the_hacking(ns, hostname);
        }
    }
}
