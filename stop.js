export async function main(ns) {
    let hostname = ns.getHostname();
    let servers = ns.scan(hostname);
    let myHackingLevel = ns.getHackingLevel();
    let scriptName = 'hack.js';

    ns.tprint(`My hacking level is ${myHackingLevel}`);

    servers.forEach(server => {
        if (server == 'home') return;

        ns.tprint(`Checking server: ${server}`);

        // killall
        ns.killall(server);

        // remove file from server
        ns.rm(scriptName, server);
    });
}
