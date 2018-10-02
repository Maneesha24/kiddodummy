module.exports = app => {
const Student = require('../models/student.js');

app.post('/students/register',(req,res)=>{
  const {body} = req;
  const student = new Student(body);
  student.save((err,student)=>{
    if(err){
      return res.send({
        success : false,
        message : 'Server error'
      });
    }else{
      return res.send({
        success : true,
        message : 'Successfully added'
      })
    }
  });

});

}
