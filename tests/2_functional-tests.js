const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
chai.use(chaiHttp);


const Browser = require('zombie');
let id1;
let id2;
let id3 = '5871dda29faedc3491ff93bb';

Browser.site = ("https://boilerplate-project-issuetracker.marcoportero.repl.co");
suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);
  const browser = new Browser();
  suiteSetup( function(done){
   return browser.visit('/', done); 
  });
  /*
  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });
  */
  suite('Test functions', function() {

  
      test('Issue with only required fields', function (done) { 
        
        chai
          .request(server)
          .post('/api/issues/apitesting')
          .set('content-type', 'application/json')
          .send({ issue_title: 'title test 02',
                  issue_text: 'issue text test 02',
                  created_by:  'Marco Portero test 02'
                })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.issue_title, 'title test 02');
            assert.equal(res.body.issue_text, 'issue text test 02');
            assert.equal(res.body.created_by,  'Marco Portero test 02');
            assert.equal(res.body.assigned_to,  '');
            assert.equal(res.body.status_text,  '');
            assert.equal(res.body.open,  true);
            id2 = res.body._id;
            done();
          });    
      });

      test('Issue with every field', function (done) {  
        
        chai
          .request(server)
          .post('/api/issues/apitesting')
          .set('content-type', 'application/json')
          .send({ issue_title: 'title test 01',
                  issue_text: 'issue text test 01',
                  created_by:  'Marco Portero test 01',
                  assigned_to:  'Leonardo Portero test 01',
                  status_text:  'issue test 01'
                })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.issue_title, 'title test 01');
            assert.equal(res.body.issue_text, 'issue text test 01');
            assert.equal(res.body.created_by,  'Marco Portero test 01');
            assert.equal(res.body.assigned_to,  'Leonardo Portero test 01');
            assert.equal(res.body.status_text,  'issue test 01');
            assert.equal(res.body.open,  true);
            id1 = res.body._id;
            done();
          });
          
      });
    
      test('issue  with missing required fields', function (done) { 
       
        chai
          .request(server)
          .post('/api/issues/apitesting')
          .set('content-type', 'application/json')
          .send({ assigned_to:  'Leonardo Portero test 03',
                })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'required field(s) missing');
            done();
          });    
      });

    test('All Issues with all the fields present for each issue', (done) => {
      chai
          .request(server)
          .get('/api/issues/apitesting')
          .end(function (err, res) {
            
            const issues = res.body;
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            
            issues.forEach ( issue => {
              assert.property(issue, '_id');
              assert.property(issue, 'issue_title');
              assert.property(issue, 'issue_text');
              assert.property(issue, 'created_on');
              assert.property(issue, 'updated_on');
              assert.property(issue, 'assigned_to');
              assert.property(issue, 'open');
              assert.property(issue, 'status_text');
            });
            done();
          });
    });
    test('View issues on a project with one filter', (done) => {
        chai
          .request(server)
          .get('/api/issues/apitesting?open=false')
          .end(function (err, res) {
            
            const issues = res.body;
            
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            
            issues.forEach ( issue => {
              assert.equal(issue.open, false);
            });
            
            done();
          });
    });
    test('View issues on a project with multiple filters', (done) => {
        chai
          .request(server)
          .get('/api/issues/apitesting?open=false&assigned_to=Leonardo Portero test 03')
          .end(function (err, res) {
            
            const issues = res.body;
            
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            
            issues.forEach ( issue => {
              assert.equal(issue.open, false);
              assert.equal(issue.assigned_to,'Leonardo Portero test 03');
            });
            
            done();
          });
    });

      test('Update one field on an issue', function (done) {       
        chai
          .request(server)
          .put('/api/issues/apitesting')
          .send({ _id: id1,
                  assigned_to:  'Marco Portero test 04'
                })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, id1);
            done();
          });      
      });

      test('Update multiple fields on an issue', function (done) {       
        chai
          .request(server)
          .put('/api/issues/apitesting')
          .send({ _id: id2,
                  assigned_to:  'Marco Portero test 05',
                  created_by:  'Leonardo Portero test 05'
                })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.result, 'successfully updated');
            assert.equal(res.body._id, id2);
            done();
          });      
      });

      test('Update an issue with missing _id', function (done) {       
        chai
          .request(server)
          .put('/api/issues/apitesting')
          .send({ 
              assigned_to:  'Marco Portero test 05',
              created_by:  'Leonardo Portero test 05'
          })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error,  'missing _id');
            done();
          });      
      });

      test('Update an issue with no fields to update', function (done) {       
        chai
          .request(server)
          .put('/api/issues/apitesting')
          .send({ 
               _id: id2 
          })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error,  'no update field(s) sent' );
            assert.equal(res.body._id,  id2 );
            done();
          });      
      });

      test('Update an issue with an invalid _id', function (done) {       
        chai
          .request(server)
          .put('/api/issues/apitesting')
          .send({ 
               _id: id3 ,
               assigned_to:  'Marco Portero test 06'
          })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error,'could not update');
            assert.equal(res.body._id, id3);
            done();
          });      
      });

      test('Delete an issue', function (done) {       
        chai
          .request(server)
          .delete('/api/issues/apitesting')
          .send({ 
               _id: id2 
          })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body._id, id2);
            assert.equal(res.body.result, 'successfully deleted');
            done();
          });      
      });

      test('Delete an issue with an invalid _id', function (done) {       
        chai
          .request(server)
          .delete('/api/issues/apitesting')
          .send({ 
               _id: id3 
          })
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body._id, id3);
            assert.equal(res.body.error, 'could not delete');
            done();
          });      
      });
    
      test('Delete an issue with missing _id', function (done) {       
        chai
          .request(server)
          .delete('/api/issues/apitesting')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status,200);
            assert.equal(res.type, 'application/json');
            assert.equal(res.body.error, 'missing _id');
            done();
          });      
      });    
  });
});
