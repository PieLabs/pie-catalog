import { PieId, DemoFileStreamer, ElementStreamer, Streamer } from '../streams';

export default class DefaultStreamer implements Streamer {

  constructor(private file: DemoFileStreamer, private element: ElementStreamer) {

  }

  demoFile(id: PieId, name: string) {
    return this.file.demoFile(id, name);
  }

  schema(id: PieId, name: string) {
    return this.element.schema(id, name);
  }
  readme(id: PieId) {
    return this.element.readme(id);
  }
  pkg(id: PieId) {
    return this.element.pkg(id);
  }

  json() {
    return this.element.json();
  }

  string() {
    return this.element.string();
  }
}