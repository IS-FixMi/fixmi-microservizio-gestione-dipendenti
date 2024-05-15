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
describe('permission middleware testing', ()=> {
    it('should return error 401, because no token provided', async()=>{
        const res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/find')
        .type('form')
        .send({
             
            email: "manager@test.com",
            mode: "one"
        });
        expect(res.statusCode).toEqual(401);

    });
    it('should return 404, becauses token is wrong ', async()=>{
        const res = await request("10.5.0.14:"+port)
        .post('/api/dipendenti/find')
        .type('form')
        .send({
            token: "123453123", 
            email: "manager@test.com",
            mode: "boh"
        });
        expect(res.statusCode).toEqual(404);

    });
  
    
   
})
