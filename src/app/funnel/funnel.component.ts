import { Component, OnInit, Input } from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';

@Component({
  selector: 'app-funnel',
  templateUrl: './funnel.component.html',
  styleUrls: ['./funnel.component.css']
})
export class FunnelComponent implements OnInit {
@Input() data:any[];
  private chart: AmChart
  ;
  public options: any;
  constructor(private AmCharts: AmChartsService) {}
  ngOnInit() {
    this.options= {"type": "funnel",
    "theme": "light",
    "dataProvider": this.data,
    "balloon": {
      "fixedPosition": true
    },
    "valueField": "value",
    "titleField": "title",
    "marginRight": 240,
    "marginLeft": 50,
    "startX": -500,
    "depth3D": 100,
    "angle": 40,
    "outlineAlpha": 1,
    "outlineColor": "#ccc",
    "outlineThickness": 2,
    "labelPosition": "right",
    "balloonText": "[[title]]: [[value]]n[[description]]",
    "export": {
      "enabled": true
    }
  } ;
  }
  ngOnDestroy() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

}
