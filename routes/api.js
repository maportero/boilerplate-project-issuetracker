'use strict';

module.exports = function(app) {

  app.route('/api/issues/:project')

    .get(function(req, res, next) {
      let project = req.params.project;
      let criteria = req.query;
      //console.log( 'criteria from find: ', criteria);
      let keys = Object.keys( criteria );
      //if (keys.length < 1 ) criteria.project = project;   
      criteria.project = project;   
      const findIssues = require("../models/issue.js").findIssues;
      findIssues(criteria, function(err, issues) {
        if (err) {
          res.json({ error: err });
          return next(err);
        }
        if (!issues) {
          //console.log("Error find issues");
          return next({ message: "Missing find issues action" });
        }
        const issues_formated = issues.map(issue => {
          return ({
          _id: issue._id.toString(),
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_on: issue.created_on,
          updated_on: issue.updated_on,
          created_by: issue.created_by,
          assigned_to: issue.assigned_to,
          open: issue.open,          
          status_text: issue.status_text
          });
        });
        //console.log('issues: ', issues_formated);
        res.json(issues_formated);
      });
    })

    .post(function(req, res, next) {
      let project = req.params.project;
      const createIssue = require("../models/issue.js").createAndSaveIssue;
      const issue = req.body;
      issue.project = project;
      //console.log( 'issue from add: ', issue);
      createIssue(issue, function(err, issue_created) {
        if (err || !issue_created) {
          //console.log({ error: 'required field(s) missing' });
          res.json({ error: 'required field(s) missing' });
          return next({ error: 'required field(s) missing' });
        }
        /*console.log('result add: ', {
          assigned_to: issue_created.assigned_to,
          status_text: issue_created.status_text,
          open: issue_created.open,
          _id: issue_created._id,
          issue_title: issue_created.issue_title,
          issue_text: issue_created.issue_text,
          created_by: issue_created.created_by,
          created_on: issue_created.created_on,
          updated_on: issue_created.updated_on,
        });
      */
        res.json({
          _id: issue_created._id,
          issue_title: issue_created.issue_title,
          issue_text: issue_created.issue_text,
          created_on: issue_created.created_on,
          updated_on: issue_created.updated_on,
          created_by: issue_created.created_by,
          assigned_to: issue_created.assigned_to,
          open: issue_created.open,          
          status_text: issue_created.status_text
        });
      });
    })

    .put(function(req, res, next) {
      let project = req.params.project;
      const _id = req.body._id;
      const updateIssueById = require("../models/issue.js").updateIssueById;
      const values = req.body;
      delete values._id;
      let keys = Object.keys(values);
      //console.log( 'values from update: ', values);
      //console.log( 'id from update: ', _id);
      if (!_id){
          //console.log({ error: 'missing _id' });
          res.json({ error: 'missing _id' });
          return next({ error: 'missing _id' });
      }
      if (keys.length < 1 ){
          //console.log({ error: 'no update field(s) sent', '_id': _id });
          res.json({ error: 'no update field(s) sent', '_id': _id });
          return next({ error: 'no update field(s) sent', '_id': _id });
      }
      updateIssueById(_id, values ,function (err,issue_updated) {
        if ( err || !issue_updated ) {
          //console.log({error: 'could not update', _id : _id });
          res.json({error: 'could not update', _id : _id });
          return next( { error: 'could not update', _id : _id });
        }
        //console.log({  result: 'successfully updated', '_id': _id });
        res.json({  result: 'successfully updated', '_id': _id }); 
      });
    })

    .delete(function(req, res, next) {
      let project = req.params.project;
      const _id = req.body._id;
      const deleteIssueById = require("../models/issue.js").deleteIssueById;
      //console.log( 'id from delete: ', _id);
      if (!_id){
          //console.log({ error: 'missing _id' });
          res.json({ error: 'missing _id' });
          return next({ error: 'missing _id' });
      }
      deleteIssueById(_id, function(err, issue_deleted) {
        if ( err || !issue_deleted ) {
          //console.log({ error: 'could not delete', '_id': _id });
          res.json({ error: 'could not delete', '_id': _id });
          return next({ error: 'could not delete', '_id': _id });
        }
        res.json({
          "result": "successfully deleted",
          "_id": issue_deleted._id
        });
      });
    });

};
