import { Injectable, computed, signal } from '@angular/core';
import {
  DrawingConfiguration,
  DrawingTool,
  DrawingToolType,
  DRAWING_TOOLS,
} from '../models/drawing-tool.model';

@Injectable({
  providedIn: 'root',
})
export class DrawingToolService {
  private activeDrawingToolSignal = signal<DrawingToolType | null>(null);
  private drawingToolsSignal = signal<DrawingTool[]>(DRAWING_TOOLS);
  private drawingConfigSignal = signal<DrawingConfiguration>({
    color: '#2196F3',
    lineWidth: 2,
    lineStyle: 0,
  });

  readonly activeDrawingTool = computed(() => this.activeDrawingToolSignal());
  readonly drawingTools = computed(() => this.drawingToolsSignal());
  readonly drawingConfig = computed(() => this.drawingConfigSignal());

  setActiveDrawingTool(tool: DrawingToolType | null) {
    this.activeDrawingToolSignal.set(tool);
  }

  updateDrawingConfig(config: Partial<DrawingConfiguration>) {
    this.drawingConfigSignal.update((current) => ({
      ...current,
      ...config,
    }));
  }

  resetDrawingTools() {
    this.activeDrawingToolSignal.set(null);
  }
}
