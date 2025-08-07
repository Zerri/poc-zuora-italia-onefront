// mocks/js/users.js
module.exports = async (req, res) => {
  if (req.url === "/users" && req.method === "GET") {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return res.json([
      {
        "_id": "USR-001",
        "fullName": "Mario Rossi",
        "email": "mario.rossi@email.com",
        "role": "admin",
        "status": "active",
        "registrationDate": "2025-01-15T08:00:00.000Z",
        "lastAccess": "2025-07-24T14:30:00.000Z",
        "avatar": null
      },
      {
        "_id": "USR-002",
        "fullName": "Laura Verdi",
        "email": "laura.verdi@email.com",
        "role": "user",
        "status": "active",
        "registrationDate": "2025-01-18T09:15:00.000Z",
        "lastAccess": "2025-07-23T16:45:00.000Z",
        "avatar": null
      },
      {
        "_id": "USR-003",
        "fullName": "Giovanni Bianchi",
        "email": "giovanni.bianchi@email.com",
        "role": "moderator",
        "status": "pending",
        "registrationDate": "2025-01-20T10:30:00.000Z",
        "lastAccess": null,
        "avatar": null
      },
      {
        "_id": "USR-004",
        "fullName": "Anna Neri",
        "email": "anna.neri@email.com",
        "role": "user",
        "status": "inactive",
        "registrationDate": "2025-01-22T11:00:00.000Z",
        "lastAccess": "2025-07-15T10:20:00.000Z",
        "avatar": null
      },
      {
        "_id": "USR-005",
        "fullName": "Franco Colombo",
        "email": "franco.colombo@email.com",
        "role": "user",
        "status": "active",
        "registrationDate": "2025-01-25T12:45:00.000Z",
        "lastAccess": "2025-07-22T18:10:00.000Z",
        "avatar": null
      },
      {
        "_id": "USR-006",
        "fullName": "Silvia Gialli",
        "email": "silvia.gialli@email.com",
        "role": "moderator",
        "status": "active",
        "registrationDate": "2025-02-01T08:30:00.000Z",
        "lastAccess": "2025-07-24T09:15:00.000Z",
        "avatar": null
      },
      {
        "_id": "USR-007",
        "fullName": "Roberto Blu",
        "email": "roberto.blu@email.com",
        "role": "user",  
        "status": "pending",
        "registrationDate": "2025-02-10T14:20:00.000Z",
        "lastAccess": null,
        "avatar": null
      }
    ]);
  }
};