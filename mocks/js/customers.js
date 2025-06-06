module.exports = async (req, res) => {
  if (req.url === "/customers" && req.method === "GET") {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return res.json([
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca9859","nome":"TEST MOCK Arredo Casa Design","settore":"Arredamento","tipo":"Cliente","email":"info@arredocasadesign.com","ultimoContatto":"2024-11-25T00:00:00.000Z","valore":24500,"valoreAnnuo":"€24.500/anno"},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca985a","nome":"AutoMotiveItalia","settore":"Automotive","tipo":"Cliente","email":"info@automotiveitalia.com","ultimoContatto":"2024-09-30T00:00:00.000Z","valore":12500,"valoreAnnuo":"€12.500/anno"},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca985b","nome":"Costruzioni Moderni","settore":"Edilizia","tipo":"Cliente","email":"info@costruzionimoderni.com","ultimoContatto":"2024-11-03T00:00:00.000Z","valore":24500,"valoreAnnuo":"€24.500/anno"},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca985c","nome":"Digital Innovatori","settore":"Digital Marketing","tipo":"Prospect","email":"info@digitalinnovatori.com","ultimoContatto":"2024-11-25T00:00:00.000Z","valore":null,"valoreAnnuo":null},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca985d","nome":"Fin-Advisor Partners","settore":"Consulenza Finanziaria","tipo":"Prospect","email":"info@finadvisorpartner.com","ultimoContatto":"2024-07-07T00:00:00.000Z","valore":null,"valoreAnnuo":null},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca985e","nome":"MediPlus","settore":"Sanitario","tipo":"Cliente","email":"info@mediplus.com","ultimoContatto":"2024-06-25T00:00:00.000Z","valore":14500,"valoreAnnuo":"€14.500/anno"},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca985f","nome":"Moda Visione S.p.A.","settore":"Fashion","tipo":"Prospect","email":"info@modavisione.com","ultimoContatto":"2024-02-05T00:00:00.000Z","valore":null,"valoreAnnuo":null},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca9860","nome":"Sapori d'Italia","settore":"Food & Beverage","tipo":"Cliente","email":"info@saporitalia.com","ultimoContatto":"2024-04-19T00:00:00.000Z","valore":22000,"valoreAnnuo":"€22.000/anno"},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca9861","nome":"TechnoSphere S.r.l.","settore":"Tecnologia","tipo":"Cliente","email":"info@technospere.com","ultimoContatto":"2024-12-12T00:00:00.000Z","valore":11500,"valoreAnnuo":"€11.500/anno"},
      {"migrabile":false,"_id":"6801f88ab61a5fff1aca9862","nome":"Trasporti Veloci","settore":"Logistica","tipo":"Prospect","email":"info@trasportiveloci.com","ultimoContatto":"2024-08-25T00:00:00.000Z","valore":null,"valoreAnnuo":null},
      {"migrabile":false,"_id":"6826e750fbca490f8992721f","nome":"Cliente 1 - LAMART S.R.L","settore":"Automotive","tipo":"Cliente","email":"info@cliente1.com","ultimoContatto":"2024-11-25T00:00:00.000Z","valore":7690,"valoreAnnuo":"€7690/anno"},
      {"_id":"6826e8d0fbca490f89927220","nome":"Cliente 3 - FILIPPI DOTT.SSA CRISTINA","settore":"Studio professionale","tipo":"Cliente","email":"info@cliente3.com","ultimoContatto":"2024-11-25T00:00:00.000Z","valore":20320,"valoreAnnuo":"€20320/anno","migrabile":true},
      {"migrabile":false,"_id":"682d8c455141da0612750ec6","nome":"Cliente 2 - OTTAVI S.R.L","settore":"Impiantistica","tipo":"Cliente","email":"info@cliente2.com","ultimoContatto":"2024-11-25T00:00:00.000Z","valore":43967,"valoreAnnuo":"€43.967/anno"},
      {"migrabile":false,"_id":"682d8d845141da0612750ec7","nome":"Cliente 4 - STUDIO VICENTIN S.R.L","settore":"Consulente del lavoro","tipo":"Cliente","email":"info@cliente4.com","ultimoContatto":"2025-02-14T00:00:00.000Z","valore":517,"valoreAnnuo":"€517/anno"},
      {"migrabile":false,"_id":"682d8e1b5141da0612750ec8","nome":"Cliente 5 - APA-FORMAZIONE E SERVICE","settore":"Consulenza fiscale","tipo":"Cliente","email":"info@cliente5.com","ultimoContatto":"2025-02-15T00:00:00.000Z","valore":30096,"valoreAnnuo":"€30.096/anno"}
    ]);
  }
}