const request = require('supertest');
const port = 3001;  

async function requestManagerToken() {
    const res = await request("10.5.0.11:3001")
            .post('/api/auth/login')
            .type('form')
            .send({email:"manager@test.com",password:"test",twofa:"12345"});
    return res.body.token;
}
let x= null;
async function getManagerToken(){
    if (x ==null){
        x = await requestManagerToken();
    }
    return x;
}

describe('create testing', ()=> {
    it('should successfully create a dipendente', async()=>{
        const res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/create')
        .type('form')
        .send({
            token: await getManagerToken(), 
            email: "testdipendente@test.com",
            password: "test",
            nome:"Marco",
            cognome: "Marconi",
            nascita: "1999-11-21",
            assunzione: "2022-01-12",
            worktag:["Negozio","Assistenza"]

        });
        expect(res.statusCode).toEqual(200);
        
        //cleanup
        await request("10.5.0.14:" + port)
              .delete('/api/dipendenti/delete')
              .type('form')
              .send({
                token:await getManagerToken(),
                email:"testdipendente@test.com"
              });
        expect(res.statusCode).toEqual(200);
    });
    it("should return an error, because nascita and assunzione are invalid", async()=>{
        let res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/create')
        .type('form')
        .send({
            token: await getManagerToken(), 
            email: "testdipendente@test.com",
            password: "test",
            nome:"Marco",
            cognome: "Marconi",
            nascita: "INVALID",
            assunzione: "31/12/2034",
            worktag:["Negozio","Assistenza"]

        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("invalid birth date");
        res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/create')
        .type('form')
        .send({
            token: await getManagerToken(), 
            email: "testdipendente@test.com",
            password: "test",
            nome:"Marco",
            cognome: "Marconi",
            nascita: "1999-11-21",
            assunzione: "INVALID",
            worktag:["Negozio","Assistenza"]

        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual("invalid assunzione date");
    });
    it("should return an error, because elements provided aren't worktags",async()=> {
        const res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/create')
        .type('form')
        .send({
            token: await getManagerToken(), 
            email: "testdipendente@test.com",
            password: "test",
            nome:"Marco",
            cognome: "Marconi",
            nascita: "1999-11-21",
            assunzione: "2022-01-12",
            worktag:["Good First Issue","Assistenza"]
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("elements provided are not worktags");

    });
    
   
})
