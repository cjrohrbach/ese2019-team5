import {Router, Request, Response} from 'express';
import {User} from '../Server (GC)/user';
import {EmailVerification} from '../Server (GC)/emailVerification';
// import jwt from 'jsonwebtoken';
var jwt = require('jsonwebtoken');
import * as fs from 'fs';



const router: Router = Router(); // part of express needed
const gillianuser = new User('gillian.cathomas@gmx.ch', 'Gillian', 'Will', '1', false, false); // TODO to delete
// when frontend signs up a new User is created which is saved (or at least should be)

const privateKey = fs.readFileSync('./app/Server (GC)/private.key', 'utf8');
const publicKey = fs.readFileSync('./app/Server (GC)/public.key', 'utf8');


router.post('/user/signup', async (req: Request, res: Response) => {

  const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(user);

  // user.formSimplification(req.body); //TODO hier noch totales Durcheinander
  // await user.save();
  res.statusCode = 201 ;
  res.send('Welcome to Express');
  console.log ('post method executed');
 // res.send(user.toSimplification());
});

router.get('/', async (req: Request, res: Response) => {

  // const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(gillianuser);

  // user.formSimplification(req.body); //TODO hier noch totales Durcheinander
  // await user.save();

  res.statusCode = 200 ;
  res.send('Welcome to Express2');

  // res.send(user.toSimplification());
});

router.get('/', (req: Request, res: Response) => {

  // const user = new User(req.body.email, req.body.name, req.body.surname, req.body.pwhash, req.body.isVerified, req.body.isAdmin);
  EmailVerification.sendMailToNewUser(gillianuser);
  res.send('Hello from user');
});


// needed to verify the token
router.get ('/confirmation/:emailToken', async (req: Request, res: Response) => {
  try {
    const emailToken = req.params.emailURl; // TODO unsure if it works
    const verifyOptions = {
      issuer: 'Eventdoo',
      subject: req.body.email,
      audience: req.body.email,
      expiresIn: '24h',
      algorithm: 'RS256'};


  jwt.verify(emailToken, publicKey, verifyOptions);
} catch (err) {
    res.send(err);
}
});





// TODO noch mals so ne function die ich keine Ahnung hab wo sie überhaupt hingehört, was für models und dann wären da noch Secret, Secret_2
// vom 2 Teil
// if user that wants to login was not found = Invalid login, if User isn't verified user is being told to verify



// router.get('/', async (req: Request, res: Response) => {
/*  const todoListID = parseInt(req.query.todoListId);
  let options = {};
  if (todoListId != null) {
    options = {
      include: [{
        model: TodoList,
        where: {
          id: todoListId
        }
      }]
    };
  }
  const instances = await TodoItem.findAll(options);
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});*/
/*

router.post('/', async (req: Request, res: Response) => {
  const instance = new TodoItem();
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 201;
  res.send(instance.toSimplification());
});
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await TodoItem.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(instance.toSimplification());
});
router.put('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await TodoItem.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 200;
  res.send(instance.toSimplification());
});
router.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await TodoItem.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.destroy();
  res.statusCode = 204;
  res.send();
});
*/

export const UserController: Router = router;
