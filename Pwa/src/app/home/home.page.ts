import { Component, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Chart } from 'angular-highcharts';

import { io } from "socket.io-client";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html'
})
export class HomePage implements OnDestroy{
  private destroy$: Subject<void> = new Subject<void>();
  chart: Chart;

  // socket = io("http://localhost:3000/eki");
  socket = io("https://projectkabeh.herokuapp.com/eki");
  vpv = 0;
  vbt = 0;
  ipv = 0;
  ibt = 0;
  wpv = 0;
  wbt = 0;

  constructor() {}

  ionViewDidEnter(){
    if(this.chart) return;
    this.chart = new Chart({
      chart: {
        type: 'spline',
        backgroundColor: '#f7faff',
        marginTop: 30,
        animation: true
      },
      lang: { noData: "Tida Ada Data Yang Di Tampilkan" },
      title: { text: null },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.key}</small><table>',
        pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y} V</b></td></tr>',
        footerFormat: '</table>',
        valueDecimals: 2
      },
      time: { useUTC: false },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        }
      },
      legend: { enabled: false },
      credits: { enabled: false },
      xAxis: { 
        type: 'datetime',
        tickPixelInterval: 100,
        title: { text: "" },
        labels: {
          format: '{value:%H:%M}',
          style: { fontSize:'10px' },
        }
      },
      yAxis: {   
        allowDecimals: false,  
        title: { text: "" },
        labels: {
          style: { fontSize:'10px' },
          align: 'left',
          x: 0,
          y: -2
        },
        minorTickLength: 10, 
        tickAmount: 8
      },
      series: [{
        id : "tegangan vpv",
        name: "tegangan PV",
        color: '#e13838',
        pointStart: Date.now(),
        // data : this.generateRandomData(),
        data : [],
        type: 'spline',
        connectNulls: false,
        zIndex: 5
      }, {
        id : "tegangan vbt",
        name: "tegangan Baterai",
        color: '#e17e38',
        pointStart: Date.now(),
        // data : this.generateRandomData(),
        data : [],
        type: 'spline',
        connectNulls: false,
        zIndex: 5
      }, {
        id : "arus ipv",
        name: "arus PV",
        color: '#073db7',
        pointStart: Date.now(),
        // data : this.generateRandomData(),
        data : [],
        type: 'spline',
        connectNulls: false,
        zIndex: 5
      }, {
        id : "arus ibt",
        name: "Arus Baterai",
        color: '#07d4b7',
        pointStart: Date.now(),
        // data : this.generateRandomData(),
        data : [],
        type: 'spline',
        connectNulls: false,
        zIndex: 5
      }, {
        id : "daya wpv",
        name: "Daya PV",
        color: '#DD6EF7',
        pointStart: Date.now(),
        // data : this.generateRandomData(),
        data : [],
        type: 'spline',
        connectNulls: false,
        zIndex: 5
      }, {
        id : "daya wbt",
        name: "Daya Baterai",
        color: '#417858',
        pointStart: Date.now(),
        // data : this.generateRandomData(),
        data : [],
        type: 'spline',
        connectNulls: false,
        zIndex: 5
      }]
    });

    this.socket.on('vpv', data => { this.vpv = Number(data) > 0? Number(data) : 0 })
    this.socket.on('vbt', data => { this.vbt = Number(data) > 0? Number(data) : 0 })
    this.socket.on('ipv', data => { this.ipv = Number(data) > 0? Number(data) : 0 })
    this.socket.on('ibt', data => { this.ibt = Number(data) > 0? Number(data) : 0 })
    this.socket.on('wpv', data => { this.wpv = Number(data) > 0? Number(data) : 0 })
    this.socket.on('wbt', data => { this.wbt = Number(data) > 0? Number(data) : 0 })

    setTimeout(_ => {
      this.setGrafik();
    }, 1000)
  }

  ngOnDestroy(){
    this.socket.disconnect();
    this.socket.removeAllListeners();

    clearInterval(this.interv);
    this.chart = null;
    this.destroy$.next();
    this.destroy$.complete();
  }

  interv: any;

  seriesVPV: any;
  lenVPV: any;
  seriesVBT: any;
  lenVBT: any;

  seriesIPV: any;
  lenIPV: any;
  seriesIBT: any;
  lenIBT: any;

  seriesWPV: any;
  lenWPV: any;
  seriesWBT: any;
  lenWBT: any;

  setGrafik(){
    this.seriesVPV = this.chart.ref.series[0];
    this.lenVPV = this.seriesVPV.data.length;
    this.addSeries(this.chart, 'end point VPV', "tegangan VPV", '#ff4081', this.seriesVPV, this.lenVPV);

    this.seriesVBT = this.chart.ref.series[1];
    this.lenVBT = this.seriesVBT.data.length;
    this.addSeries(this.chart, 'end point VBT', "tegangan VBT", '#e17e38', this.seriesVBT, this.lenVBT);

    this.seriesIPV = this.chart.ref.series[2];
    this.lenIPV = this.seriesIPV.data.length;
    this.addSeries(this.chart, 'end point IPV', "arus IPV", '#073db7', this.seriesIPV, this.lenIPV);

    this.seriesIBT = this.chart.ref.series[3];
    this.lenIBT = this.seriesIBT.data.length;
    this.addSeries(this.chart, 'end point IBT', "arus IBT", '#07d4b7', this.seriesIBT, this.lenIBT);

    
    this.seriesWPV = this.chart.ref.series[4];
    this.lenWPV = this.seriesWPV.data.length;
    this.addSeries(this.chart, 'end point WPV', "Daya WPV", '#DD6EF7', this.seriesWPV, this.lenWPV);

    this.seriesWBT = this.chart.ref.series[5];
    this.lenWBT = this.seriesWBT.data.length;
    this.addSeries(this.chart, 'end point WBT', "Daya WBT", '#417858', this.seriesWBT, this.lenWBT);

    this.interv = setInterval(() => {
      // if(this.statusAlat.boolean){
        let x = Date.now();
        this.add(this.chart, 'end point VPV', Number(this.vpv), x);
        this.add(this.chart, 'end point VBT', Number(this.vbt), x);

        this.add(this.chart, 'end point IPV', Number(this.ipv), x);
        this.add(this.chart, 'end point IBT', Number(this.ibt), x);

        this.add(this.chart, 'end point WPV', Number(this.wpv), x);
        this.add(this.chart, 'end point WBT', Number(this.wbt), x);

        this.chart.ref.series[4].addPoint([x, Number(this.wbt)], false, (this.shift >= 10));
        this.chart.ref.series[5].addPoint([x, Number(this.wpv)], false, (this.shift >= 10));

        this.chart.ref.series[3].addPoint([x, Number(this.ibt)], false, (this.shift >= 10));
        this.chart.ref.series[2].addPoint([x, Number(this.ipv)], false, (this.shift >= 10));

        this.chart.ref.series[1].addPoint([x, Number(this.vbt)], false, (this.shift >= 10));
        this.chart.ref.series[0].addPoint([x, Number(this.vpv)], true, (this.shift >= 10));
        if(this.shift < 11) this.shift++;
      // }else{
        // this.sensor.vpv = 0;
        // this.sensor.vbt = 0;
        // this.sensor.vld = 0;
        // this.sensor.ipv = 0;
        // this.sensor.ibt = 0;
        // this.sensor.ild = 0;
      // }
    }, 1000);
  }

  addSeries(chart, id, name, color, series, len){
    let cls = 'tegangan';
    let satuan = 'V'
    if(name.includes("tegangan")){
      cls = 'tegangan';
      satuan = 'V';
    }else if(name.includes("arus")){
      cls = 'arus';
      satuan = 'I';
    }else if(name.includes("daya")){
      cls = 'daya';
      satuan = 'W';
    }

    let data = []
    if(len > 0){
      data = [series.data[len - 1].x, series.data[len - 1].y]
    }

    chart.ref.addSeries({
      id: id,
      type: 'scatter',
      color: color,
      name: name,
      marker: {
        enabled: true,
        symbol:'circle',
        radius:4,
        fillColor: color,
        lineColor: color,
        lineWidth:2
      },
      dataLabels: {
        enabled: false,
        color: color,
        useHTML: true,
        format: '<div class="last-point data-label-' + cls + '" style="background: '+ color +';">{y} ' + satuan + '</div>',
        x: 0,
        y: -5
      },
      data: [data],
      zIndex: 1
    });
  }

  shift = 0;
  add(chart, id, data, x){
    let series2 : any = chart.ref.get(id);
    series2.data[0].update([x, data]);
  }
}
