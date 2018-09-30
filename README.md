# Live Tracker
Lightweight, vanilla javascript/svg library (~1kb gzipped 🎉)

![Alt text](https://raw.githubusercontent.com/thiswallz/live-tracker/master/demo.png?raw=true 'Example 1')


## Demo

[Link]()

## Install

### npm
```html
npm install --save live-tracker
```

## Usage

Install via npm(see above) or Download/clone the files

Link to JS file ex.:
```html
<script src="src/index.min.js" type="text/javascript"></script>
```

Element to render
```html
<div class="container">
</div>
```

To initialize Live-tracker:
```javascript
var livet = new LiveTracker({
    render: document.getElementsByClassName("container")[0],
    steps: [{
    iconFill: "#fff",
    iconSvg: "m3.48439,15.83231l2.79376,-3.50417l7.65345,9.59499l12.75805,-15.99165l2.79474,3.5017l-15.55279,19.4983"
    },
    {
    iconFill: "#fff",
    iconSvg: "m3.48439,15.83231l2.79376,-3.50417l7.65345,9.59499l12.75805,-15.99165l2.79474,3.5017l-15.55279,19.4983"
    },
    {
    iconFill: "#fff",
    iconSvg: "m3.48439,15.83231l2.79376,-3.50417l7.65345,9.59499l12.75805,-15.99165l2.79474,3.5017l-15.55279,19.4983"
    },
    {
    iconFill: "#fff",
    iconSvg: "m3.48439,15.83231l2.79376,-3.50417l7.65345,9.59499l12.75805,-15.99165l2.79474,3.5017l-15.55279,19.4983"
    },
    {
    iconFill: "#fff",
    iconSvg: "m3.48439,15.83231l2.79376,-3.50417l7.65345,9.59499l12.75805,-15.99165l2.79474,3.5017l-15.55279,19.4983"
    },
    {
    iconFill: "#fff",
    iconSvg: "m3.48439,15.83231l2.79376,-3.50417l7.65345,9.59499l12.75805,-15.99165l2.79474,3.5017l-15.55279,19.4983"
    }]
});

livet.setActive(3);
livet.setProgress(0, 100);
livet.setProgress(1, 100);
livet.setProgress(2, 100);
livet.setProgress(3, 60);
```

## Methods

Method | Description
------ | -----------
.setActive(step) | active a stage
.setProgress(step, percentage) | set progress for one stage


