// var request = require("supertest")

//Require the dev-dependencies
let chai = require('chai');
let assert = chai.assert;
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe("login Endpoint",() => {
    it("Returns the Token after login", (done) => {
        chai.request(app).post("/login")
        .send({"username": "shubham", "password": "Random"})
        .end((err,res) => {
            let token = res.body.token;
            assert.isDefined(token);
            assert.typeOf(token,"string");
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.key("token");
            done();
        })
    })
});


describe("Json Patch Endpoint",() => {
    it("", (done) => {
        chai.request(app).post("/jsonPatch")
        .send({"jsonObj": {"baz": "qux","foo": "bar"},"Patch": [{"op": "replace","path": "/baz","value": "boo"}]})
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7fSwiaWF0IjoxNTQyNjYwMTg5LCJleHAiOjE1NDI2NjEyMTl9.OgDCrNPesLNvwvucc4I0f5S4g_BMM7HAPiIS5n63F1M")
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
        })
    })
})

describe("Thumbnail Endpoint",() => {
    
    it("Returns the thumbnail from an image", function(done) {
        this.timeout(5000);
        chai.request(app).post("/thumbnail")
        .send({"uri": "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fbeebom-redkapmedia.netdna-ssl.com%2Fwp-content%2Fuploads%2F2016%2F01%2FReverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg&f=1"
        })
        .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7fSwiaWF0IjoxNTQyNjYwMTg5LCJleHAiOjE1NDI2NjEyMTl9.OgDCrNPesLNvwvucc4I0f5S4g_BMM7HAPiIS5n63F1M")
        .end((err,res) => {
            let thumbnail = res.body.thumbnail;
            assert.isDefined(thumbnail);
            assert.typeOf(thumbnail,"object");
            res.should.have.status(200);
            done();
        })
    })
})
