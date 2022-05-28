const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true } );

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  issue_title: { type : String, required : true },
  issue_text: { type : String, required : true },
  created_on: { type: Date, default: Date.now },
  updated_on: { type: Date, default: Date.now },
  created_by: { type : String, required : true },
  assigned_to: { type : String, default:''   },
  open: { type : Boolean, default : true },
  status_text: { type : String, default:''  },
  project: { type : String }
})

let Issue = mongoose.model('Issue', issueSchema);

const createAndSaveIssue = (data , done ) => {
   let issue = new Issue(data);
   issue.save((err,issueSaved) => {
     if (err){
       done(err.message,null);
     }else done(null , issueSaved );
   })
};

const findIssues = ( criteria, done) => {
    const query = Issue.find();
    query.where( criteria )
    query.exec( (err, issues) => {
      if (err) {
       done(err.message,null);
     }else done(null, issues);
    });
};

const deleteIssueById = ( id, done) => {
    Issue.findByIdAndDelete(id, (err, issue_deleted) => {
      if (err) {
       done(err.message,null);
     }else done(null, issue_deleted);
    });
};

const updateIssueById = ( id, values , done) => {
    values.updated_on = new Date();
    //console.log( 'values before: ',values)
    Issue.findByIdAndUpdate(id, values , (err, issue_updated) => {
      if (err) {
       done(err.message,null);
     }else done(null, issue_updated);
    });
};


exports.IssueModel = Issue;
exports.createAndSaveIssue = createAndSaveIssue;
exports.findIssues = findIssues;
exports.deleteIssueById = deleteIssueById;
exports.updateIssueById = updateIssueById;