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

describe('history testing', ()=> {
    it('should successfully delete a dipendente', async()=>{
        const res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/history')
        .type('form')
        .send({
            token: await getManagerToken(), 
            email: "manager@test.com",
        });
        expect(res.statusCode).toEqual(200);

    });
    it("should return an error, because user not found", async()=>{
        const res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/history')
        .type('form')
        .send({
            token: await getManagerToken(), 
            email: "cthulhu@test.com",

        });
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual("dipendente not found");

    });
  
    
   
})
