const express =  require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8000 ;

app.use(bodyParser.json());

let users = [];
let counter = 1 ;
/**
 GET / users - ดึงข้อมูลผู้ใช้ทั้งหมด
 POST /users - เพิ่มผู้ใช้ใหม่
 GET /users/:id - ดึงข้อมูลผู้ใช้ตามID
 PUT /users/:id - แก้ไขข้อมุลผู้ใช้ตาม ID ที่บันทึก
 DELETE /users/:id - ลบผู้ใช้ตามIDที่บันทึก
 */


// path: = GET / users
app.get('/users',(req,res)=>{

    res.json(users);
});

// path: = POST
app.post('/user',(req,res)=>{
    let user = req.body;
    user.id = counter
    counter += 1;

    users.push(user);
    res.json({
    massage: 'User added successfully' , 
    user : user
    });
    
});

// path: = PUT / user / :id
app.patch('/user/:id',(req,res) => {
    let id = req.params.id;
    let updatedUser = req.body;

    // หา user จาก id ที่ส่งมา
    let seleactedIndex = users.findIndex(user => user.id == id);
  //อัพเดตข้อมูล users

    //users[seleactedIndex].firstname = updatedUser.firstname || users[seleactedIndex].firstname;
    //users[seleactedIndex].lastname = updatedUser.lastname || users[seleactedIndex].lastname;

    if(updatedUser.firstname){
        users[seleactedIndex].firstname = updatedUser.firstname;
    }
    if (updatedUser.lastname){
         users[seleactedIndex].lastnamename = updatedUser.lastname;
    }
    

    res.json({
        massage: 'User updated successfully' ,
        data:{
            user: updatedUser,
            indexUpdate: seleactedIndex
        }
    });
    //ส่ง users ที่อัพเดตแล้วกลับไป
    
});


app.delete('/users/:id', (req, res)=>{
    let id = req.params.id;

    // หา index จาก id ที่ต้องการลบ
    let selectIndex = users.findIndex(user => user.id == id);

    users.splice(selectIndex, 1)
    //ลบ user ออกจาก users
    res.json({
        message: 'User deleted successfully!',
        indexDelete: selectIndex
    });
});
  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});