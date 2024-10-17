import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
export class CoursComponent {
  chapters = [
    { name: 'Chapter 1: Introduction', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 1' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 1' }
    ]},
    { name: 'Chapter 2: Advanced Concepts', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 2' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 2' }
    ]},
    { name: 'Chapter 3: Case Studies', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 3' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 3' }
    ]},
    { name: 'Chapter 4: Case Studies', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 3' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 3' }
    ]},
    { name: 'Chapter 5: Case Studies', topics: [
      { title: 'Topic 1', description: 'This is the first topic of Chapter 3' },
      { title: 'Topic 2', description: 'This is the second topic of Chapter 3' }
    ]}
  ];

  selectedChapter = 0;
  selectedChapterContent = this.chapters[this.selectedChapter];

  selectChapter(index: number): void {
    this.selectedChapter = index;
    this.selectedChapterContent = this.chapters[index];
  }
}
