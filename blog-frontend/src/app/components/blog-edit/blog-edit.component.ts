import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import tinymce from 'tinymce';

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [EditorComponent, FormsModule],
  templateUrl: './blog-edit.component.html',
  styleUrl: './blog-edit.component.css',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class BlogEditComponent {
  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins:
      'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
    toolbar:
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
    skin: 'oxide-dark',
    content_css: 'dark',
    height: 720,
  };

  getEditorContent = () => {
    return tinymce.activeEditor?.getContent();
  };
}
