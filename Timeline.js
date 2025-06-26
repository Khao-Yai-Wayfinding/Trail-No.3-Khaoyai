// Minimal Timeline: 6 sections, each with 5 horizontal subsections, all info removed

class FloraTimeline {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sections = 6;
    this.subsections = 5;
    this.createTimeline();
  }

  createTimeline() {
    this.container.innerHTML = '';
    this.container.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: stretch;
      border-radius: 12px;
      box-shadow: 0 2px 8px #0004;
      min-height: 180px;
      overflow: hidden;
      position: relative;
    `;

    // Section 1 (0 km.)
    const section1 = document.createElement('div');
    section1.className = 'timeline-section';
    section1.style.cssText = `
      flex: 1 1 0;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: stretch;
      border-left: 1px solid #fff;
      border-right: 1px solid #fff;
      position: relative;
      height: 100%;
      box-sizing: border-box;
      padding: 0;
      padding-top: 28px;
      padding-bottom: 28px;
    `;
    const kmLabel1 = document.createElement('div');
    kmLabel1.textContent = '0 km.';
    kmLabel1.style.cssText = `
      position: absolute;
      left: -10px;
      top: 50%;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      background: transparent;
      padding: 0 4px;
      z-index: 2;
      pointer-events: none;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: left center;
      white-space: nowrap;
    `;
    section1.appendChild(kmLabel1);
    for (let j = 0; j < this.subsections; j++) {
      const sub = document.createElement('div');
      sub.className = 'timeline-subbox';
      sub.style.cssText = `
        flex: 1 1 0;
        height: 100%;
        width: 100%;
        background: transparent;
        border-left: ${j === 0 ? 'none' : '1.5px solid #fff'};
        border-right: ${j === this.subsections - 1 ? 'none' : '1.5px solid #fff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
        overflow: hidden;
        box-sizing: border-box;
      `;
      section1.appendChild(sub);
    }
    this.container.appendChild(section1);

    // Section 2 (0.5 km.)
    const section2 = document.createElement('div');
    section2.className = 'timeline-section';
    section2.style.cssText = section1.style.cssText;
    const kmLabel2 = document.createElement('div');
    kmLabel2.textContent = '0.5 km.';
    kmLabel2.style.cssText = `
      position: absolute;
      left: -10px;
      top: 50%;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      background: transparent;
      padding: 0 4px;
      z-index: 2;
      pointer-events: none;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: left center;
      white-space: nowrap;
    `;
    section2.appendChild(kmLabel2);
    for (let j = 0; j < this.subsections; j++) {
      const sub = document.createElement('div');
      sub.className = 'timeline-subbox';
      sub.style.cssText = `
        flex: 1 1 0;
        height: 100%;
        width: 100%;
        background: transparent;
        border-left: ${j === 0 ? 'none' : '1.5px solid #fff'};
        border-right: ${j === this.subsections - 1 ? 'none' : '1.5px solid #fff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
        overflow: hidden;
        box-sizing: border-box;
      `;
      section2.appendChild(sub);
    }
    this.container.appendChild(section2);

    // Section 3 (1.5 km.)
    const section3 = document.createElement('div');
    section3.className = 'timeline-section';
    section3.style.cssText = section1.style.cssText;
    const kmLabel3 = document.createElement('div');
    kmLabel3.textContent = '1.5 km.';
    kmLabel3.style.cssText = `
      position: absolute;
      left: -10px;
      top: 50%;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      background: transparent;
      padding: 0 4px;
      z-index: 2;
      pointer-events: none;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: left center;
      white-space: nowrap;
    `;
    section3.appendChild(kmLabel3);
    for (let j = 0; j < this.subsections; j++) {
      const sub = document.createElement('div');
      sub.className = 'timeline-subbox';
      sub.style.cssText = `
        flex: 1 1 0;
        height: 100%;
        width: 100%;
        background: transparent;
        border-left: ${j === 0 ? 'none' : '1.5px solid #fff'};
        border-right: ${j === this.subsections - 1 ? 'none' : '1.5px solid #fff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
        overflow: hidden;
        box-sizing: border-box;
      `;
      section3.appendChild(sub);
    }
    this.container.appendChild(section3);

    // Section 4 (2.5 km.)
    const section4 = document.createElement('div');
    section4.className = 'timeline-section';
    section4.style.cssText = section1.style.cssText;
    const kmLabel4 = document.createElement('div');
    kmLabel4.textContent = '2.5 km.';
    kmLabel4.style.cssText = `
      position: absolute;
      left: -10px;
      top: 50%;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      background: transparent;
      padding: 0 4px;
      z-index: 2;
      pointer-events: none;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: left center;
      white-space: nowrap;
    `;
    section4.appendChild(kmLabel4);
    for (let j = 0; j < this.subsections; j++) {
      const sub = document.createElement('div');
      sub.className = 'timeline-subbox';
      sub.style.cssText = `
        flex: 1 1 0;
        height: 100%;
        width: 100%;
        background: transparent;
        border-left: ${j === 0 ? 'none' : '1.5px solid #fff'};
        border-right: ${j === this.subsections - 1 ? 'none' : '1.5px solid #fff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
        overflow: hidden;
        box-sizing: border-box;
      `;
      section4.appendChild(sub);
    }
    this.container.appendChild(section4);

    // Section 5 (3.5 km.)
    const section5 = document.createElement('div');
    section5.className = 'timeline-section';
    section5.style.cssText = section1.style.cssText;
    const kmLabel5 = document.createElement('div');
    kmLabel5.textContent = '3.5 km.';
    kmLabel5.style.cssText = `
      position: absolute;
      left: -10px;
      top: 50%;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      background: transparent;
      padding: 0 4px;
      z-index: 2;
      pointer-events: none;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: left center;
      white-space: nowrap;
    `;
    section5.appendChild(kmLabel5);
    for (let j = 0; j < this.subsections; j++) {
      const sub = document.createElement('div');
      sub.className = 'timeline-subbox';
      sub.style.cssText = `
        flex: 1 1 0;
        height: 100%;
        width: 100%;
        background: transparent;
        border-left: ${j === 0 ? 'none' : '1.5px solid #fff'};
        border-right: ${j === this.subsections - 1 ? 'none' : '1.5px solid #fff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
        overflow: hidden;
        box-sizing: border-box;
      `;
      section5.appendChild(sub);
    }
    this.container.appendChild(section5);

    // Section 6 (3.9 km.)
    const section6 = document.createElement('div');
    section6.className = 'timeline-section';
    section6.style.cssText = section1.style.cssText;
    const kmLabel6 = document.createElement('div');
    kmLabel6.textContent = '3.9 km.';
    kmLabel6.style.cssText = `
      position: absolute;
      left: -10px;
      top: 50%;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      background: transparent;
      padding: 0 4px;
      z-index: 2;
      pointer-events: none;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: left center;
      white-space: nowrap;
    `;
    section6.appendChild(kmLabel6);
    for (let j = 0; j < this.subsections; j++) {
      const sub = document.createElement('div');
      sub.className = 'timeline-subbox';
      sub.style.cssText = `
        flex: 1 1 0;
        height: 100%;
        width: 100%;
        background: transparent;
        border-left: ${j === 0 ? 'none' : '1.5px solid #fff'};
        border-right: ${j === this.subsections - 1 ? 'none' : '1.5px solid #fff'};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.2s;
        overflow: hidden;
        box-sizing: border-box;
      `;
      section6.appendChild(sub);
    }
    this.container.appendChild(section6);

    // After appending section6, add the rightmost label
    const kmLabel7 = document.createElement('div');
    kmLabel7.textContent = '4.2 km.';
    kmLabel7.style.cssText = `
      position: absolute;
      right: -10px;
      top: 50%;
      color: #fff;
      font-size: 13px;
      font-weight: bold;
      background: transparent;
      padding: 0 4px;
      z-index: 2;
      pointer-events: none;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: right center;
      white-space: nowrap;
    `;
    this.container.appendChild(kmLabel7);
  }
}

// Initialize timeline when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    const timelineContainer = document.querySelector('.timeline-box');
    if (timelineContainer) {
      window.FloraTimeline = new FloraTimeline('timeline-box');
    }
  }, 200);
});