import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RedeSocial } from './resolucao.model';
import { RESOLUCOES } from './resolucoes-mock';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  imgEvent: any;
  imgHeight: number = 1;
  imgWidth: number = 1;
  loadingImg: boolean = false;
  resolucoes: RedeSocial[] = RESOLUCOES;
  btnsEscolhaRedeSocial: boolean = false;
  form: FormGroup;
  storiesBtn:boolean = false;
  redeSocialSelecionda: string = '';
  croppedImage: any;
  fotoConfirmada: boolean = false;
  showFeed = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fb: FormBuilder,
    private camera: Camera,
    private toastCtrl: ToastController,
    private socialSharing: SocialSharing,
    private loadingController: LoadingController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit(){
    this.form = this.fb.group({foto: null});
  }

  imageCropped(e) {
    this.croppedImage = e.base64;
  }

  abrirCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imgEvent = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
       this.showToast('Ocorreu um erro ao tirar a foto, tente novamente!');

     });
  }

  inputChange(event: any) {
    console.log('inputChange -> event', event);
    this.loadingImg = true;
    this.imgEvent = event;
    this.loadingImg = false;
  }

  escolherRedeSocial(redeSocial: string){
    this.btnsEscolhaRedeSocial = true;
    this.redeSocialSelecionda = redeSocial;
    redeSocial === 'Twitter' ? this.storiesBtn = false : this.storiesBtn = true;
    this.resolucoes = this.resolucoes.filter(r => r.nome === redeSocial);
  }

  escolherTipo(tipo: string){
    console.log('tipo.slice(0,4)', tipo.slice(0, 4));
    if (tipo.slice(0, 4) === 'feed') {
      this.showFeed = true;
      return;
    } else {
      this.showFeed = false;
    }
    this.resolucoes = RESOLUCOES;
    this.resolucoes = this.resolucoes.filter(r => r.postagem === tipo);
    this.imgHeight = this.resolucoes[0].resolucao.heightRatio;
    this.imgWidth = this.resolucoes[0].resolucao.widthRatio;
  }

  voltarOpcoes(){
    this.resolucoes = RESOLUCOES;
    this.btnsEscolhaRedeSocial = false;
  }

  voltarInicio(){
    this.btnsEscolhaRedeSocial = false;
    this.redeSocialSelecionda = '';
    this.loadingImg = false;
    this.imgEvent = null;
    this.resolucoes = RESOLUCOES;
    this.imgHeight = 1;
    this.imgWidth = 1;
    this.form.reset();
    this.fotoConfirmada = false;
  }

  async postar(){
    this.fotoConfirmada = true;
    // abrir rede social pra postar

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Carregando...',
    });

    this.socialSharing.share('', '', this.croppedImage, '')
    .then(result => {
      console.log('SHARE RESULT', result);
    })
    .catch(err => {
      this.showToast('Ocorreu um erro inesperado ao compartilhar imagem');
      console.error('SHARE ERROR', err);
    })
    .finally(() => {
      loading.dismiss();
    });
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  }
}
