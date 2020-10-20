const { req, res } = require('express')
const express = require('express')
const app = express()
const Sequelize = require('sequelize')

const sequelize = new Sequelize('profile', 'root', 'pass', {
    dialect: "mysql",
    host: "localhost"
})

sequelize.authenticate().then(() => {
    console.log("Connected to database")
}).catch((err) => {
    console.log(err)
    console.log("Unable to connect to database")
})

app.get('/createdb', (request, response) => {
    sequelize.sync({force:true}).then(() => {
        response.status(200).send('tables created')
    }).catch((err) => {
        console.log(err)
        response.status(200).send('could not create tables')
    })
})

const Messages = sequelize.define('messages', {
    subject: Sequelize.STRING,
    name: Sequelize.STRING,
    message: Sequelize.TEXT
})





app.use('/', express.static('frontend'))
app.use(express.json())
app.use(express.urlencoded())


// app.post('/messages',(req,res) => {
//     Messages.create(req.body).then((result) => {
//         res.status(201).json(result)
//     }).catch((err) => {
//         res.status(500).send("resource not created")
//     })
// })

app.post('/messages', async (req,res) => {
    try{
        let result = await Messages.create(req.body)
        res.status(201).json(result)
    } catch(err) {
        console.log(err);
        res.status(500).send('database error')
    }
})

// app.get('/messages', (req,res) => {
//     Messages.findAll().then((results) => {
//         res.status(200).json(results)
//     })
// })

app.get('/messages', async(req,res) => {
    try {
        let result = await Messages.findAll()
        res.status(201).json(result)
    } catch(err) {
        console.log(err)
        res.status(500).send('database error')
    }
})

// app.get('/messages/:id', (req,res) => {
//     Messages.findByPk(req.params.id).then((result) => {
//         if(result) {
//             res.status(200).json(result)
//         } else {
//             res.status(404).send('Resource not found')
//         }
//     }).catch((err) => {
//         console.log(err)
//         res.status(500).send('Database error')
//     })
// })

app.get('/messages/:id', async(req,res) => {
    try {
        let result = await Messages.findByPk(req.params.id)
        if(result) {
            res.status(200).json(result)
        } else {
            res.status(404).send('resource not found')
        }
    } catch(err) {
        console.log(err)
        res.status(500).send('database error')
    }
})
 
// app.put('/messages/:id', (req,res)=> {
//     Messages.findByPk(req.params.id).then((message) => {
//         if(message) {
//             message.update(req.body).then((result) => {
//                 res.status(201).json(result)
//             }).catch((err) => {
//                 res.status(500).send('database error')
//             })
//         } else {
//             res.status(404).send('resource not found')
//         }
//     }).catch((err) =>  {
//         console.log(err)
//         res.status(500).send('database error')
//     })
// })

app.put('/messages/:id', async(req,res) => {
    try {
        let result = await Messages.findByPk(req.params.id)
        if(result) {
            let message = await result.update(req.body)
            res.status(201).json(message)
        } else {
            res.status(404).send('resource not found')
        }
    } catch(err) {
        res.status(500).send('database error')
    }
})

// app.delete('/messages/:id', (req,res) => {
//     Messages.findByPk(req.params.id).then((message) => {
//         if(message) {
//             message.destroy().then((result) => {
//                 res.status(204).send()
//             }).catch((err) => {
//                 res.status(500).send('Database error')
//             })
//         } else  {
//             res.status(404).send('source not found')
//         }
//     }).catch((err) => {
//         console.log(err);
//         res.status(500).send('database error')
//     })
// })

app.delete('/messages/:id' , async (req,res) => {
    try{
        let message = await Messages.findByPk(req.params.id)
        if(message) {
            await message.destroy()
            res.status(201).send('Deleted')
        } else {
            res.status(404).send('resource not found')
        }
    } catch(err) {
        console.log(err)
        res.status(500).send('database error')
    }
})
 
app.listen(8080)