const nazivKesMem = "prvaVerzija";

const statSadrzaj = [
    '/',
    'index.html',
    'druga.html',
    'manifest.json',
    'css/style.css',
    'css/materialize.min.css',
    'js/materialize.min.js'
];


self.addEventListener('install', async e => {
    console.log("instaliran sw");

    const kesMem = await caches.open(nazivKesMem);
    await kesMem.addAll(statSadrzaj);

    return self.skipWaiting();
});

self.addEventListener('activate', async e => {
    console.log("aktiviran sw");

    self.clients.claim();
});

self.addEventListener('push', dog => {
    const podaci = dog.data.json();
        self.registration.showNotification(podaci.title, {
            body: podaci.body
        })
});


self.addEventListener('fetch', async dog => {
    const zahtev = dog.request;
    const url = new URL(zahtev.url);

    if (url.origin === location.origin) {
        dog.respondWith(vratiIzKesMemorije(zahtev));
    } else {
        dog.respondWith(vratiSaMrezeIliIzKesMemorije
            (zahtev));
    }

});

async function vratiIzKesMemorije(zahtev) {
    const kes = await caches.open(nazivKesMem);
    const kesiraniPodaci = await kes.match(zahtev);
    return kesiraniPodaci || fetch(zahtev);
}

async function vratiSaMrezeIliIzKesMemorije(zahtev) {
    const kes = await caches.open(nazivKesMem);

    try {
        const najnovijiPodaci = await fetch(zahtev);
        await kes.put(zahtev, najnovijiPodaci.clone());
        return najnovijiPodaci;
    } catch (error) {
        const kesiraniPodaci = await kes.match(zahtev);
        return kesiraniPodaci
    }

}