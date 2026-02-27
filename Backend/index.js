const express =  require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8000 ;

const initMySQL = async () => {
    conn = await mysql.createConnection({
         host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'webdb',
            port: 8700
    });
    console.log('Connected to MYSQL database');
}

app.get('/testdb-new', async (req, res) => {
    try {

        const results = await conn.query('SELECT * FROM users');
        res.json(results[0]);

    } catch (err) {
        console.error('Error connecting to the database:' , err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//path: Get /users สำหรับดึงข้อมูล users ทั้งหมด
app.get('/users', async(req,res)=>{
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
})
//path: POST /ueses สำหรับเพื่ม user ใหม่
app.post('/users',async(req,res)=>{
    try{
        let user = req.body;
    const results = await conn.query('INSERT INTO users SET ?',user);
    res.json({
        massage: 'User added successfully',
        data: results[0]
    });

    }catch(error){
        console.error('Error inserting user:',error);
        res.status(500).json({message: 'Erorr adding user'});
    }
})
//path: = GET / users/:id สำหรัลดึงข้อมู, user ตาม id
    app.get('/users/:id',async(req,res)=> {
        try{
            let id = req.params.id;
            const results = await conn.query('SELECT * FROM users WHERE id = ?',id);
            if(results[0].length === 0){
                throw{ statusCode: 404, message: 'User not found'};
            }
            res.json(results[0][0]);
        }catch(error){
            console.error('Error fetching user:',error);
            let statusCode = error.statusCode || 500;
            res.status(statusCode).json({
                massage: error.massage || 'Error fetching user'
            });
        }
    })

//path: = PUT /users/:id สำหรับอัพเดตข้อมูล User ตาม id
app.put('/users/:id',async(req,res) =>{
    let id = req.params.id;
    let updatedUser = req.body;
    const results = await conn.query('UPDATE users SET ? WHERE id = ?', id);
    res.json({
        message: 'User deleted successfully',
        data: results[0]
    });


})

/**     const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password:   'root',
        database: 'webdb',
        port:8700
    });
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);

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
  
app.listen(port, async() => {
    await initMySQL();
    console.log(`Server is running on http://localhost:${port}`);
});
