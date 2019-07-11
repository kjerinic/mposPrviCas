const express = require('express');
const fetch = require('node-fetch');
const webPush = require('web-push');
const Datastore = require('nedb');

const publicVapidKey = "BCKcmijEXML89kXg5Zt-aZAEPzOO-fFbA38L5pCUak8vA89MU6DYKTR26KHry359Vkowlln-l2KFwQbusLQLayQ";
const privateVapidKey = "J0tcj43HVkp-TW3HWnbztZBHJ2FPCQo_M0KCl1cqdoQ";
const guardianApiKey = "05572908-fc58-4061-a4e7-2f9cc2e990f1";


const app = express();
app.listen(3000, () => console.log("Server ceka zahteve."));
app.use(express.static('public'));
app.use(express.json({ limit: '2mb' }));

const baza = new Datastore('baza.db');
baza.loadDatabase();

//push notifs
webPush.setVapidDetails(
    "mailto:kjtest@test.com",
    publicVapidKey,
    privateVapidKey
);

app.get('/drzava/:latlon', async (zah, odg) => {
    var apikey = '0b47275ff17b4922bc17fef296eede57';
    var api_url = 'https://api.opencagedata.com/geocode/v1/json';

    const latlon = zah.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];

    var request_url = api_url
        + '?'
        + 'key=' + apikey
        + '&q=' + encodeURIComponent(lat + ',' + lon)
        + '&pretty=1'
        + '&no_annotations=1';

    const fetchOdg = await fetch(request_url);
    const jsonGeolok = await fetchOdg.json();
    odg.json(jsonGeolok);
});


app.get('/desetclanaka/:drzava', async (zah, odg) => {
    const drzava = zah.params.drzava;

    const timestamp = Date.now();
    baza.insert({ drzava: drzava, vreme: timestamp });
    console.log(drzava);

    const urlD = `https://content.guardianapis.com/search?q=${drzava}&api-key=${guardianApiKey}`;

    const guardianOdgD = await fetch(urlD);
    const jsonGuardD = await guardianOdgD.json();

    console.log(jsonGuardD.response.userTier);

    //vracamo niz clanaka
    odg.json(jsonGuardD.response.results);
});

app.get('/desetclanakasvet', async (zah, odg) => {
    const urlS = `https://content.guardianapis.com/search?api-key=${guardianApiKey}`;

    const guardianOdgS = await fetch(urlS);
    const jsonGuardS = await guardianOdgS.json();

    console.log(jsonGuardS.response.userTier);

    //vracamo niz clanaka
    odg.json(jsonGuardS.response.results);
});

app.get('/desetclanakasvet/:kriterijumPretrage', async (zah, odg) => {
    var kat = zah.params.kriterijumPretrage;
    const urlSU = `https://content.guardianapis.com/search?q=${kat}&api-key=${guardianApiKey}`;

    const guardianOdgSU = await fetch(urlSU);
    const jsonGuardSU = await guardianOdgSU.json();

    console.log(jsonGuardSU.response.userTier);

    //vracamo niz clanaka
    odg.json(jsonGuardSU.response.results);
});


app.get('/desetclanakadrzava/:drzavaKategorija', async (zah, odg) => {
    const drzavaKategorija = zah.params.drzavaKategorija.split(",");
    const drzavaDU = drzavaKategorija[0];
    const kategorijaDU = drzavaKategorija[1];
    console.log(drzavaDU);
    console.log(kategorijaDU);
    const urlDU = `https://content.guardianapis.com/search?q=${drzavaDU}%20${kategorijaDU}&api-key=${guardianApiKey}`;

    const guardianOdgDU = await fetch(urlDU);
    const jsonGuardDU = await guardianOdgDU.json();

    console.log(jsonGuardDU.response.userTier);

    //vracamo niz clanaka
    odg.json(jsonGuardDU.response.results);
});


//ruta za subscribe
app.post("/subscribe", (zahtev, odgovor) => {
    //uzimamo objekat subscription od klijenta
    const subscription = zahtev.body;

    //za vracenje odgovora
    //vracamo status uspesno pravljenje
    odgovor.status(201).json({});

    const payload = JSON.stringify({
        title: "Dobrodošli na Gardijanovu progresivnu veb aplikaciju!",
        body: "telo poruke"
    });

    //saljemo ovaj objekat
    webPush.sendNotification(subscription, payload).catch(greska => console.error(greska));
});

app.post("/komentar", (zahtev, odgovor) => {
    const slikaKomentar = zahtev.body;
    baza.insert(slikaKomentar);
    odgovor.json(slikaKomentar);

});