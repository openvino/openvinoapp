// ---------- ADD IMPORTS -------------
import {authenticate} from '@loopback/authentication';
// ------------------------------------
@authenticate('jwt') // <---- Apply the @authenticate decorator at the class level
export class AppController {
  //...
}