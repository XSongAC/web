import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Widget } from '../models/widget.model.client';

@Injectable()
export class WidgetService {

    constructor() { }

  widgets: Widget[] = [
    new Widget('123', 'HEADING', '321', '2', 'GIZMODO' ),
    new Widget('234', 'HEADER', '321', '4', 'GIZMODO' ),
    new Widget('345', 'IMAGE', '321', '2', 'text', '100%', 'http://lorempixel.com/400/200/'),
    new Widget('456', 'HTML', '321', '2', '<p>blalbla</p>' ),
    new Widget('567', 'HEADING', '321', '4', 'text', '100%', 'https://youtube.com/token' ),
    new Widget('678', 'YOUTUBE', '321', '2', 'GIZMODO' ),
    new Widget('789', 'HTML', '321', '2', '<p>Lorem ipsum</p>' ),
  ];

    api = {
        'createWidget': this.createWidget,
        'findWidgetsByPageId': this.findWidgetsByPageId,
        'findWidgetById': this.findWidgetById,
        'updateWidget': this.updateWidget,
        'deleteWidget': this.deleteWidget
    };

    createWidget(pageId: String, widget: any) {
        widget._id = Math.random().toString();
        widget.pageId = pageId;
        this.widgets.push(widget);
    }

    findWidgetsByPageId(pageId: String) {
        const resultSet: Widget[] = [];
        for (let x = 0; x < this.widgets.length; x++) {
            if (this.widgets[x].pageId === pageId) {
                resultSet.push(this.widgets[x]);
            }
        }
        return resultSet;
    }

    findWidgetById(widgetId: String) {
        for (let x = 0; x < this.widgets.length; x++) {
            if (this.widgets[x]._id === widgetId) {
                return this.widgets[x];
            }
        }
    }

    updateWidget(widgetId: String, widget: any) {
        for (let x = 0; x < this.widgets.length; x++) {
            if (this.widgets[x]._id === widgetId && this.widgets[x].widgetType === widget.widgetType) {
                switch (widget.widgetType) {
                    case 'HEADER':
                        this.widgets[x].text = widget.text;
                        this.widgets[x].size = widget.size;
                        return true;

                    case 'IMAGE':
                        this.widgets[x].text = widget.text;
                        this.widgets[x].url = widget.url;
                        this.widgets[x].width = widget.width;
                        return true;

                    case 'YOUTUBE':
                        this.widgets[x].text = widget.text;
                        this.widgets[x].url = widget.url;
                        this.widgets[x].width = widget.width;
                        return true;
                }
            }
        }
    }

    deleteWidget(widgetId: String) {
        for (let x = 0; x < this.widgets.length; x++) {
            if (this.widgets[x]._id === widgetId) {
                this.widgets.splice(x, 1);
            }
        }
    }
}
