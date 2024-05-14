const request = require('supertest');

async function requestManagerToken() {
    const res = await request("localhost:3001")
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
export { getManagerToken};