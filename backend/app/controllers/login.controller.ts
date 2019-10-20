import {Router, Request, Response} from 'express';

import {DbServices} from '../services/db.services'
import {LoginResult} from "../models/loginResult.model";

const dbService = new DbServices();
const router: Router = Router();


router.post('/', async (req: Request, res: Response) => {
  const email = req.body.email; // evt auch req.params.email
  const pwhash = req.body.pwhash;
  console.log('entered login');
  console.log(email);
  console.log(pwhash);

  try {
    const loginResult = await dbService.tryLogin(email, pwhash);
    const sessionToken = loginResult.token;
    const user= dbService.getUserFromEmail(email);
    res.send(sessionToken + user); //TODO user auch noch nach vorne senden
    res.statusCode = 200;
  } catch (error) {
    res.status(404);
    res.send(error.msg);
  }
});








// von Cyrill glaubs

router.get('/test', async (req: Request, res: Response) => {
    res.statusCode = 200;
    res.send('00000sessionToken');
});

router.get('/test/:email/:pw', async (req: Request, res: Response) => {
  const email = req.params.email;
  const pwhash = req.params.pw;

  try {
    const loginResult = await dbService.tryLogin(email, pwhash);
    const sessionToken = loginResult.token;
    res.statusCode = 200;
    res.send(sessionToken);
  } catch (e) {
    console.log(e);
    res.statusCode = 400;
    res.send(e.msg);
  }
});















/*






// helper functions
  function ok(body?: {
      id: any; email: any; token: string;
      }) {
    return of(new HttpResponse({status: 200, body}));
  }

  function error(message: string) {
    return throwError( { error: {message} } );
  }
*/

  export const LoginController: Router = router;

