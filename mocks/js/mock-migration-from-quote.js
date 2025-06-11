module.exports = async (req, res) => {
  if (req.url === "/migration/6826e8d0fbca490f89927220" && req.method === "GET") {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return res.json({
      subscriptionId: "6826e8f0f9e8cf54bb685fb3",
      customer: {
        email: "info@cliente3.com",
        name: "Cliente 3 - FILIPPI DOTT.SSA CRISTINA",
        sector: "Studio professionale",
        id: "6826e8d0fbca490f89927220"
      },
      sourceProducts: [
        {
          id: "8ad0869c95911c6e0195a35866271652",
          name: "Spid Professionale 2022 LS-7958 PoC",
          price: 225,
          customerPrice: 187.99,
          quantity: 1,
          description: "Servizio di identità digitale per professionisti",
          category: "professional",
          ratePlan: {
            id: "9336bebf62895911c4f5a358667200a9",
            name: "Full Subscription SAAS",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "SAAS"
          },
          charges: [
            {
              id: "9336bebf62895911c4f5a35866ab00aa",
              name: "Canone x PDL",
              type: "Recurring",
              model: "Volume",
              value: 1,
              calculatedPrice: 225
            }
          ]
        },
        {
          id: "8ad09124959133640195a3638a8f06af",
          name: "Tasi LS-7879 PoC",
          price: 413.58,
          customerPrice: 413.58,
          quantity: 1,
          description: "Gestione tasse sui servizi indivisibili",
          category: "professional",
          ratePlan: {
            id: "93360368c2d959133445a3638af50033",
            name: "Licanza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "93360368c2d959133445a3638b170034",
              name: "Canone x PDL",
              type: "Recurring",
              model: "Volume",
              value: 6,
              calculatedPrice: 413.58
            }
          ]
        },
        {
          id: "8ad0869c95911c6e0195a36b5ad71b01",
          name: "Bundle Contabilita e Dichiarazioni LS-7731 PoC",
          price: 5426.65,
          customerPrice: 5426.65,
          quantity: 1,
          description: "Soluzione completa per gestione contabile e dichiarativa",
          category: "enterprise",
          ratePlan: {
            id: "9336bebf63a95911c4f5a36b5b130037",
            name: "Licanza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336bebf63a95911c4f5a36b5b290038",
              name: "Canone x PDL",
              type: "Recurring",
              model: "Volume",
              value: 6,
              calculatedPrice: 5426.65
            }
          ]
        },
        {
          id: "8ad09124959133640195a3717c170a18",
          name: "Database C-Tree Lynfa Studio LS-7308 PoC",
          price: 6053.6,
          customerPrice: 6021.93,
          quantity: 1,
          description: "Database ottimizzato per Lynfa Studio",
          category: "enterprise",
          ratePlan: {
            id: "93360368c21959133445a3717c3b0071",
            name: "Full Subscription On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "93360368c21959133445a3717c5c0072",
              name: "Canone Per Unit",
              type: "Recurring",
              model: "PerUnit",
              value: 161,
              calculatedPrice: 6053.6
            }
          ]
        },
        {
          id: "8ad0869c95911c6e0195a375aa6f1fcb",
          name: "Polyedro per Utenti Lynfa Studio LS-7300 PoC",
          price: 526.4,
          customerPrice: 526.37,
          quantity: 1,
          description: "Piattaforma Polyedro integrata per Lynfa Studio",
          category: "enterprise",
          ratePlan: {
            id: "9336bebf63a95911c4f5a375aab50055",
            name: "Licenza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336bebf63a95911c4f5a375aacd0056",
              name: "Canone Per Unit",
              type: "Recurring",
              model: "PerUnit",
              value: 7,
              calculatedPrice: 526.4
            }
          ]
        },
        {
          id: "8ad09124959133640195a36e552808c3",
          name: "Gestione Leasing Finanziario LS-7419 PoC",
          price: 87.73,
          customerPrice: 87.73,
          quantity: 1,
          description: "Modulo per la gestione dei contratti di leasing",
          category: "professional",
          ratePlan: {
            id: "93360368c28959133445a36e55910015",
            name: "Licanza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "93360368c28959133445a36e55af0016",
              name: "Canone x PDL",
              type: "Recurring",
              model: "Volume",
              value: 6,
              calculatedPrice: 87.73
            }
          ]
        },
        {
          id: "8ad086fa95911c5d0195a355aa7512e6",
          name: "Soglia Max Ore Teleassistenza TELED-TEAMSYSTEM PoC",
          price: 225.59,
          customerPrice: 225.59,
          quantity: 1,
          description: "Pacchetto ore supporto tecnico",
          category: "cross",
          ratePlan: {
            id: "9336383e22d95911c3f5a355aaf10020",
            name: "Full Subscription On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336383e22d95911c3f5a355aaff0021",
              name: "Canone Flat Fee",
              type: "Recurring",
              model: "FlatFee",
              value: 0,
              calculatedPrice: 225.59
            }
          ]
        },
        {
          id: "8ad093f7959133870195a35cccfb7e97",
          name: "Certificazione Unica Completa LS-7890 PoC",
          price: 430,
          customerPrice: 626.64,
          quantity: 1,
          description: "Gestione certificazioni uniche per dipendenti e autonomi",
          category: "professional",
          ratePlan: {
            id: "933616628da959133685a35ccda70031",
            name: "LTA On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "933616628da959133685a35ccdc80032",
              name: "Canone x PDL",
              type: "Recurring",
              model: "Volume",
              value: 7,
              calculatedPrice: 430
            }
          ]
        },
        {
          id: "8ad086fa958d2d30019590018879564c",
          name: "Contabilità Entry Online LS-85009 PoC",
          price: 614.1,
          customerPrice: 614.1,
          quantity: 1,
          description: "Soluzione cloud per contabilità base",
          category: "professional",
          ratePlan: {
            id: "9336383e2cb958d2d0f5900188c90076",
            name: "Licenza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336383e2cb958d2d0f5900188d90077",
              name: "Canone Flat Fee",
              type: "Recurring",
              model: "FlatFee",
              value: 0,
              calculatedPrice: 614.1
            }
          ]
        },
        {
          id: "8ad0869c95911c6e0195a36853601ab4",
          name: "Comunicazione Spese Sanitarie LS-7447 PoC",
          price: 187.99,
          customerPrice: 187.99,
          quantity: 1,
          description: "Modulo per invio telematico spese sanitarie",
          category: "professional",
          ratePlan: {
            id: "9336bebf6e695911c4f5a36853780024",
            name: "Licenza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336bebf6e695911c4f5a368538e0025",
              name: "Canone Flat Fee",
              type: "Recurring",
              model: "FlatFee",
              value: 0,
              calculatedPrice: 187.99
            }
          ]
        },
        {
          id: "8ad0869c95911c6e0195a3609ab71964",
          name: "Concolle Telematici Gest Integrata Comuni LS-7823 PoC",
          price: 250.66,
          customerPrice: 250.66,
          quantity: 1,
          description: "Gestione integrata per enti pubblici",
          category: "professional",
          ratePlan: {
            id: "9336bebf6eb95911c4f5a3609ae8002d",
            name: "Licenza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336bebf6eb95911c4f5a3609b02002e",
              name: "Canone Flat Fee",
              type: "Recurring",
              model: "FlatFee",
              value: 0,
              calculatedPrice: 250.66
            }
          ]
        },
        {
          id: "8ad093f7958d56b4019590064ba0572d",
          name: "Gestione Studio Light LS-85029 PoC",
          price: 438.65,
          customerPrice: 438.65,
          quantity: 1,
          description: "Soluzione base per la gestione dello studio professionale",
          category: "professional",
          ratePlan: {
            id: "93360368c28958d56865900ff0240035",
            name: "Licenza + Canone On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "93360368c28958d56865900ff07d0036",
              name: "Da 3 Pdl in poi",
              type: "Recurring",
              model: "PerUnit",
              value: 1,
              calculatedPrice: 20
            },
            {
              id: "93360368c28958d56865900ff0b9003b",
              name: "Canone Flat Fee",
              type: "Recurring",
              model: "Volume",
              value: 1,
              calculatedPrice: 418.65
            }
          ]
        },
        {
          id: "8ad0869c958d2d3b01958fee165c5075",
          name: "Kit Corrispettivi LS-85535 PoC",
          price: 285,
          customerPrice: 263.75,
          quantity: 1,
          description: "Soluzione per gestione corrispettivi elettronici",
          category: "professional",
          ratePlan: {
            id: "9336383e2cb958d2d0f58ff2d3d70052",
            name: "LTA On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336383e2cb958d2d0f58ff2d3ea0053",
              name: "Canone x PDL",
              type: "Recurring",
              model: "Volume",
              value: 2,
              calculatedPrice: 285
            }
          ]
        },
        {
          id: "8ad086fa95911c5d0195a366441015e7",
          name: "Kit Adempimenti LS-7869 PoC",
          price: 488.77,
          customerPrice: 488.77,
          quantity: 1,
          description: "Kit completo per adempimenti fiscali",
          category: "professional",
          ratePlan: {
            id: "9336383e21d95911c3f5a36644650025",
            name: "LTA On Premise",
            description: "Rateo da data attivazione a 31 dic",
            Infrastructure__c: "On Premise"
          },
          charges: [
            {
              id: "9336383e21d95911c3f5a366447f0026",
              name: "Canone x PDL",
              type: "Recurring",
              model: "Volume",
              value: 6,
              calculatedPrice: 488.77
            }
          ]
        }
      ],
      migrationPaths: {
        saas: {
          id: "saas",
          title: "Cloud SaaS",
          description: "Migrazione verso servizi cloud completamente gestiti",
          benefits: [
            "Nessuna gestione dell'infrastruttura",
            "Aggiornamenti automatici",
            "Scalabilità on-demand"
          ],
          totalValue: 17710, // Valore totale senza sconti
          percentChange: "+12.4%", // Calcolato rispetto al totale corrente
          products: [
            {
              id: "8ad09124958d56ab01958eb3dccd2179",
              name: "Tax Advanced LS-85164 PoC",
              price: 15590,
              customerPrice: 15590, // Rimosso lo sconto
              quantity: 1,
              description: "Soluzione avanzata per gestione fiscale in cloud",
              category: "enterprise",
              ratePlan: {
                id: "93360368c46958d568658eb3dd6e0019",
                name: "Full Subscription SAAS",
                description: "Rateo da data attivazione a 31 dic",
                Infrastructure__c: "SAAS"
              },
              charges: [
                {
                  id: "93360368c46958d568658eb3dd9b001a",
                  name: "Canone x PDL",
                  type: "Recurring",
                  model: "Volume",
                  value: 7,
                  calculatedPrice: 15590
                }
              ],
              replacesProductId: "8ad0869c95911c6e0195a36b5ad71b01"
            },
            {
              id: "8ad086fa958d2d3001958fe48e6d50b1",
              name: "100 Dichiarazioni Telematiche Addizionali LS-85175 PoC",
              price: 400,
              customerPrice: 400, // Rimosso lo sconto
              quantity: 1,
              description: "Pacchetto aggiuntivo di dichiarazioni telematiche",
              category: "professional",
              ratePlan: {
                id: "9336383e229958d2d0f58fe48fc8007e",
                name: "Full Subscription SAAS",
                description: "Rateo da data attivazione a 31 dic",
                Infrastructure__c: "SAAS"
              },
              charges: [
                {
                  id: "9336383e229958d2d0f58fe48fdc007f",
                  name: "Canone Flat Fee",
                  type: "Recurring",
                  model: "FlatFee",
                  value: 0,
                  calculatedPrice: 400
                }
              ],
              replacesProductId: "8ad093f7959133870195a35cccfb7e97"
            },
            {
              id: "8ad0869c958d2d3b01958fe8d96a4f47",
              name: "Telematico lettere di intento (free) SAAS-LS-85160 PoC",
              price: 0,
              customerPrice: 0,
              quantity: 1,
              description: "Modulo gratuito per la gestione delle lettere di intento",
              category: "professional",
              ratePlan: {
                id: "9336bebf61e958d2d1958fe8daeb0076",
                name: "Full Subscription SAAS",
                description: "Rateo da data attivazione a 31 dic",
                Infrastructure__c: "SAAS"
              },
              charges: [
                {
                  id: "9336bebf61e958d2d1958fe8dafd0077",
                  name: "Canone Flat Fee",
                  type: "Recurring",
                  model: "FlatFee",
                  value: 0,
                  calculatedPrice: 0
                }
              ]
            },
            {
              id: "8ad0869c958d2d3b01958fee165c5075",
              name: "Kit Corrispettivi LS-85535 PoC",
              price: 465,
              customerPrice: 465, // Rimosso lo sconto
              quantity: 1,
              description: "Soluzione per gestione corrispettivi elettronici",
              category: "professional",
              ratePlan: {
                id: "9336bebf6c3958d2d1958fee16a3000b",
                name: "LTA Abbonamento SAAS",
                description: "Rateo da data attivazione a 31 dic",
                Infrastructure__c: "SAAS"
              },
              charges: [
                {
                  id: "9336bebf6c3958d2d1958fee16b6000c",
                  name: "Canone x PDL",
                  type: "Recurring",
                  model: "Volume",
                  value: 7,
                  calculatedPrice: 465
                }
              ],
              replacesProductId: "8ad0869c958d2d3b01958fee165c5075"
            },
            {
              id: "8ad086fa958d2d30019590018879564c",
              name: "Contabilità Entry Online LS-85009 PoC",
              price: 605,
              customerPrice: 605, // Rimosso lo sconto
              quantity: 1,
              description: "Soluzione cloud per contabilità base",
              category: "professional",
              ratePlan: {
                id: "9336383e2cb958d2d0f59001888d0070",
                name: "Full Subscription SAAS",
                description: "Rateo da data attivazione a 31 dic",
                Infrastructure__c: "SAAS"
              },
              charges: [
                {
                  id: "9336383e2cb958d2d0f59001889e0071",
                  name: "Canone Flat Fee",
                  type: "Recurring",
                  model: "FlatFee",
                  value: 0,
                  calculatedPrice: 605
                }
              ],
              replacesProductId: "8ad086fa958d2d30019590018879564c"
            },
            {
              id: "8ad093f7958d56b4019590064ba0572d",
              name: "Gestione Studio Light LS-85029 PoC",
              price: 650,
              customerPrice: 650, // Rimosso lo sconto
              quantity: 1,
              description: "Soluzione base per la gestione dello studio professionale",
              category: "professional",
              ratePlan: {
                id: "9336166289b958d5691590064bc60025",
                name: "Full Subscription SAAS",
                description: "Rateo da data attivazione a 31 dic",
                Infrastructure__c: "SAAS"
              },
              charges: [
                {
                  id: "9336166289b958d5691590064bee0026",
                  name: "Canone Flat Fee",
                  type: "Recurring",
                  model: "Volume",
                  value: 2,
                  calculatedPrice: 570
                },
                {
                  id: "9336166280e958d56915900eaa920047",
                  name: "Da 3 Pdl in poi",
                  type: "Recurring",
                  model: "PerUnit",
                  value: 4,
                  calculatedPrice: 80
                }
              ],
              replacesProductId: "8ad093f7958d56b4019590064ba0572d"
            }
          ]
        },
        iaas: {
          id: "iaas",
          title: "TS Studio IaaS",
          description: "Migrazione verso infrastruttura cloud self-managed",
          benefits: [
            "Maggiore controllo",
            "Personalizzazione avanzata",
            "Utilizzo dell'infrastruttura esistente"
          ],
          totalValue: 14500,
          percentChange: "-6.4%", // Calcolato rispetto al totale corrente
          products: [
            {
              id: "iaas-201",
              name: "TeamSystem Professional IaaS",
              description: "Soluzione completa su infrastruttura cloud",
              category: "enterprise",
              price: 8200,
              customerPrice: 8200, // Nessuno sconto sul prodotto nuovo
              quantity: 1,
              ratePlan: {
                id: "rp-iaas-201",
                name: "Professional IaaS Premium",
                Infrastructure__c: "IAAS"
              },
              charges: [
                {
                  id: "charge-iaas-201",
                  name: "Canone Base IaaS",
                  type: "Recurring",
                  model: "FlatFee",
                  value: 1,
                  calculatedPrice: 8200
                }
              ],
              replacesProductId: "8ad0869c95911c6e0195a36b5ad71b01"
            },
            {
              id: "iaas-202",
              name: "TeamSystem Contabilità IaaS",
              description: "Gestione contabile professionale su infrastruttura cloud",
              category: "professional",
              price: 3400,
              customerPrice: 3400, // Nessuno sconto sul prodotto nuovo
              quantity: 1,
              ratePlan: {
                id: "rp-iaas-202",
                name: "Contabilità IaaS Premium",
                Infrastructure__c: "IAAS"
              },
              charges: [
                {
                  id: "charge-iaas-202",
                  name: "Canone Contabilità IaaS",
                  type: "Recurring",
                  model: "FlatFee",
                  value: 1,
                  calculatedPrice: 3400
                }
              ],
              replacesProductId: "8ad086fa958d2d30019590018879564c"
            },
            {
              id: "iaas-203",
              name: "TeamSystem Dichiarazioni IaaS",
              description: "Soluzione dichiarativa completa su infrastruttura cloud",
              category: "professional",
              price: 2100,
              customerPrice: 2100, // Nessuno sconto sul prodotto nuovo
              quantity: 1,
              ratePlan: {
                id: "rp-iaas-203",
                name: "Dichiarazioni IaaS",
                Infrastructure__c: "IAAS"
              },
              charges: [
                {
                  id: "charge-iaas-203",
                  name: "Canone Dichiarazioni IaaS",
                  type: "Recurring",
                  model: "FlatFee",
                  value: 1,
                  calculatedPrice: 2100
                }
              ],
              replacesProductId: "8ad093f7959133870195a35cccfb7e97"
            },
            {
              id: "iaas-204",
              name: "TeamSystem Migration Tool",
              description: "Strumento di migrazione dati per infrastruttura cloud",
              category: "cross",
              price: 800,
              customerPrice: 800, // Nessuno sconto sul prodotto nuovo
              quantity: 1,
              ratePlan: {
                id: "rp-iaas-204",
                name: "Migration Tool",
                Infrastructure__c: "IAAS"
              },
              charges: [
                {
                  id: "charge-iaas-204",
                  name: "Licenza Migration Tool",
                  type: "OneTime",
                  model: "FlatFee",
                  value: 1,
                  calculatedPrice: 800
                }
              ]
            }
          ]
        }
      },
      nonMigrableProductIds: [
        "8ad086fa95911c5d0195a355aa7512e6"  // Soglia Max Ore Teleassistenza
      ],
      nonMigrableReasons: {
        "8ad086fa95911c5d0195a355aa7512e6": "Servizio di supporto obsoleto che sarà sostituito da nuove modalità di assistenza cloud"
      },
      summary: {
        currentValue: 15760.4, // Valore totale del preventivo originale
        currentCustomerValue: 15760.4, // Stesso valore
        saasValue: 16642.28, // Aggiornato con il nuovo valore
        iaasValue: 14500
      }
    });
  }
}