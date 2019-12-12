// require pakete koji nam trebaju: express i node-fetch


// api kljuc za vesti
const guardianApiKey = "05572908-fc58-4061-a4e7-2f9cc2e990f1";

// pokreni express aplikaciju

// pokreni server na portu 3000


app.get('/drzava/:latlon', async (zah, odg) => {
    var apikey = '0b47275ff17b4922bc17fef296eede57';
    var api_url = 'https://api.opencagedata.com/geocode/v1/json';

    // parsiraj parametre iz zahteva
    const latlon = zah.params.latlon.split(',');
    console.log(latlon);
    const lat;
    const lon;

    var request_url = api_url
        + '?'
        + 'key=' + apikey
        + '&q=' + encodeURIComponent(lat + ',' + lon)
        + '&pretty=1'
        + '&no_annotations=1';

    // daj odgovor
    const fetchOdg;
    const jsonGeolok;
    odg.json(jsonGeolok);
});


app.get('/desetclanaka/:drzava', async (zah, odg) => {
    const drzava = zah.params.drzava;

    console.log(drzava);

    const guardianDrzavaURL = `https://content.guardianapis.com/search?q=${drzava}&api-key=${guardianApiKey}`;

    const guardianDrzavaODG = await fetch(guardianDrzavaURL);
    const jsonDrzava = await guardianDrzavaODG.json();

    // vracamo niz clanaka

});

app.get('/desetclanakasvet', async (zah, odg) => {
    const guardianSvetURL = `https://content.guardianapis.com/search?api-key=${guardianApiKey}`;

    const guardianSvetODG = await fetch(guardianSvetURL);
    const jsonSvet = await guardianSvetODG.json();

    //vracamo niz clanaka

});