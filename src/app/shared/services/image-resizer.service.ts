import { Injectable } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { from, Observable } from 'rxjs';
import { map, catchError, switchAll } from 'rxjs/operators';
import { DOC_ORIENTATION } from 'ngx-image-compress';

@Injectable({ providedIn: 'root' })
export class ImageUtilService {
     constructor(private imageCompress: NgxImageCompressService) { }

     private validateImage(file: File): void {
          const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
          if (!validTypes.includes(file.type)) {
               throw new Error('Unsupported image format (JPEG, PNG, or WEBP only)');
          }
          if (file.size > 20 * 1024 * 1024) {
               throw new Error('Image too large (max 20MB)');
          }
     }

     compressImage(file: File): Observable<{
          file: File;
          preview: string;
          originalSize: number;
          compressedSize: number;
     }> {
          this.validateImage(file);
          const MAX_SIZE_MB = 3;
          const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
          const maxWidthOrHeight = 1920;

          let quality = 75;

          const compressIteratively = (dataUrl: string): Observable<{
               file: File;
               preview: string;
               originalSize: number;
               compressedSize: number;
          }> => {
               const compressedBlob = this.dataURLtoBlob(dataUrl, file.type);
               const compressedFile = new File([compressedBlob], file.name, {
                    type: file.type,
                    lastModified: Date.now()
               });

               if (compressedFile.size <= MAX_SIZE_BYTES || quality < 10) {
                    return from(Promise.resolve({
                         file: compressedFile,
                         preview: dataUrl,
                         originalSize: file.size,
                         compressedSize: compressedFile.size
                    }));
               }

               quality -= 5; // Decrease quality step-by-step
               return from(
                    this.imageCompress.compressFile(
                         URL.createObjectURL(file),
                         DOC_ORIENTATION.Default,
                         quality,
                         50,
                         maxWidthOrHeight
                    )
               ).pipe(
                    map(nextDataUrl => {
                         return compressIteratively(nextDataUrl);
                    }),
                    // flatten nested observable
                    switchAll()
               );
          };

          return from(
               this.imageCompress.compressFile(
                    URL.createObjectURL(file),
                    DOC_ORIENTATION.Default,
                    quality,
                    50,
                    maxWidthOrHeight
               )
          ).pipe(
               map(initialDataUrl => compressIteratively(initialDataUrl)),
               switchAll(),
               catchError(error => {
                    console.error('Compression error:', error);
                    throw new Error('Failed to compress image');
               })
          );
     }

     private dataURLtoBlob(dataUrl: string, mimeType: string): Blob {
          const byteString = atob(dataUrl.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
               ia[i] = byteString.charCodeAt(i);
          }
          return new Blob([ab], { type: mimeType });
     }
        
}