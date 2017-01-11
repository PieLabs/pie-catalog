export default class InfoPanel extends HTMLElement {

  constructor() {
    super();
    let sr = this.attachShadow({ mode: 'open' });
    sr.innerHTML = `
      <style>
        :host {
          border: solid 1px #449933;
          display: block;
          margin-top: 10px;
          margin-bottom: 10px;
        }
      </style>
      <table>
        <tbody>
        <tr>
          <td>INFO PANEL</td>
        </tr>
        </tbody>
      </table>
    `;
  }
}