import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, CameraPhoto, Photo } from '@capacitor/camera'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Preferences } from '@capacitor/preferences'
import { Foto } from '../models/foto.interface'
import { WebView } from '@capacitor/core';
import { registerInjectable } from '@angular/core/primitives/di';


@Injectable({
  providedIn: 'root',
})
export class FotoService {
  //arreglar el amacenamiento de foto
  public fotos: Foto[] = []; //arreglo foto
  private PHOTO_STORAGE: string = "fotos";

  constructor() { }

  public async addNewToGallery() {
    //codigo nativo para tomar una foto
    //codigo nativo va a ser funcional en android, ios, o en web
    const fotoCapturada = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })

    /*
    this.fotos.unshift({  //poner la foto al inicio del arreglo
      filepath: "foto_",
      webviewPath: fotoCapturada.dataUrl
    }) */
    const saveImageFile = await this.savePicture(fotoCapturada)
    this.fotos.unshift(saveImageFile)

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.fotos)
    })

  }
  public async savePicture(cameraPhoto: CameraPhoto) {
    //convertir la foto a formato base64
    const base64Data = await this.readAsBase64(cameraPhoto)
    //escribir la foto en el directorio
    const fileName = new Date().getTime() + '.jpeg';
    const saveFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    })

    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath

    }
  }

  public async readAsBase64(cameraPhoto: CameraPhoto) {
    //convertir de blob
    const response = await fetch(cameraPhoto.webPath!)
    const blob = await response.blob()
    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });


  public async loadSaved() {
    const listaFotos = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.fotos = JSON.parse(listaFotos.value ?? '[]');

    //desplegar fotos leidas en formato base64
    for (let foto of this.fotos) {
      //leer cada foto almacenada en el system file
      const readFile = await Filesystem.readFile({
        path: foto.filepath,
        directory: Directory.Data
      })

      //para páginas web
      foto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }

  }
}
