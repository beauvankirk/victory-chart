<template lang="pug">
component(:is="this.standalone ? this.containerComponent : simplewrapper")
  component(:is="this.dataComponent")
    const { role } = this.constructor;
    const props = Helpers.modifyProps(this.props, fallbackProps, role);
    if (this.shouldAnimate()) {
      return this.animateComponent(props, animationWhitelist);
    }
    const children = this.renderContinuousData(props);
    return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
</template>

<script>
import { partialRight } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import LineHelpers from "./helper-methods";
import {
  PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme,
  DefaultTransitions, Curve, VictoryClipContainer, Data, Domain
} from "victory-core";
import { BaseProps, DataProps } from "../../helpers/common-props";

const fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  interpolation: "linear"
};

const animationWhitelist = ["data", "domain", "height", "padding", "samples", "style", "width"];

// class VictoryLine extends React.Component {
const VictoryLine = {
  // static displayName = "VictoryLine";
  name: 'VictoryLine',
  mixins: [addEvents],
  // static role = "line";

  // static defaultTransitions = DefaultTransitions.continuousTransitions();

  // static continuous = true;
  props: {
    categories: [Array, Object],
    // PropTypes.oneOfType([
    //   PropTypes.arrayOf(PropTypes.string),
    //   PropTypes.shape({
    //     x: PropTypes.arrayOf(PropTypes.string), y: PropTypes.arrayOf(PropTypes.string)
    //   })
    // ]),
    data: Array,
    // data: PropTypes.array,
    dataComponent: {
      type: String,
      default: 'curve'
    },
    // dataComponent: PropTypes.element,
    labelComponent: {
      type: String,
      default: 'victory-label'
    },
    // labelComponent: PropTypes.element,
    labels: [Function, Array],
    // labels: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    samples: {
      type: Number,
      default: 50
    },
    // samples: CustomPropTypes.nonNegative,
    sortKey: {
      type: [Function, Number, String, Array],
      default: 'x'
    },
    // sortKey: PropTypes.oneOfType([
    //   PropTypes.func,
    //   CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
    //   PropTypes.string,
    //   PropTypes.arrayOf(PropTypes.string)
    // ]),
    style: Object,
    // style: PropTypes.shape({
    //   parent: PropTypes.object, data: PropTypes.object, labels: PropTypes.object
    // }),
    x: [Function, Number, String, Array],
    // x: PropTypes.oneOfType([
    //   PropTypes.func,
    //   CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
    //   PropTypes.string,
    //   PropTypes.arrayOf(PropTypes.string)
    // ]),
    y: [Function, Number, String, Array],
    // y: PropTypes.oneOfType([
    //   PropTypes.func,
    //   CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
    //   PropTypes.string,
    //   PropTypes.arrayOf(PropTypes.string)
    // ]),
    y0: [Function, Number, String, Array],
    // y0: PropTypes.oneOfType([
    //   PropTypes.func,
    //   CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
    //   PropTypes.string,
    //   PropTypes.arrayOf(PropTypes.string)
    // ])
    animate: Object,
    // animate: PropTypes.object,
    containerComponent: {
      type: String,
      default: 'victory-container'
    },
    // containerComponent: PropTypes.element,
    domain: [Object, Number, Array, String],
    // domain: PropTypes.oneOfType([
    //   CustomPropTypes.domain,
    //   PropTypes.shape({ x: CustomPropTypes.domain, y: CustomPropTypes.domain })
    // ]),
    domainPadding: [Object, Number, Array],
    // domainPadding: PropTypes.oneOfType([
    //   PropTypes.shape({
    //     x: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    //     y: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)])
    //   }),
    //   PropTypes.number,
    //   PropTypes.arrayOf(PropTypes.number)
    // ]),
    eventKey: [Function, Number, String],
    // eventKey: PropTypes.oneOfType([
    //   PropTypes.func,
    //   CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
    //   PropTypes.string
    // ]),
    events: Array,
    // events: PropTypes.arrayOf(PropTypes.shape({
    //   target: PropTypes.oneOf(["data", "labels", "parent"]),
    //   eventKey: PropTypes.oneOfType([
    //     PropTypes.array,
    //     CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]),
    //     PropTypes.string
    //   ]),
    //   eventHandlers: PropTypes.object
    // })),
    groupComponent: {
      type: String,
      default: 'victory-clip-component'
    },
    // groupComponent: PropTypes.element,
    height: Number,
    // height: CustomPropTypes.nonNegative,
    name: String,
    // name: PropTypes.string,
    padding: [Number, Object],
    // padding: PropTypes.oneOfType([
    //   PropTypes.number,
    //   PropTypes.shape({
    //     top: PropTypes.number, bottom: PropTypes.number,
    //     left: PropTypes.number, right: PropTypes.number
    //   })
    // ]),
    scale: [Object, Number, Array, String],
    // scale: PropTypes.oneOfType([
    //   CustomPropTypes.scale,
    //   PropTypes.shape({ x: CustomPropTypes.scale, y: CustomPropTypes.scale })
    // ]),
    sharedEvents: Object,
    // sharedEvents: PropTypes.shape({
    //   events: PropTypes.array,
    //   getEventState: PropTypes.func
    // }),
    standalone: {
      type: Boolean,
      default: true
    },
    // standalone: PropTypes.bool,
    theme: {
      type: Object,
      default: VictoryTheme.grayscale
    },
    // theme: PropTypes.object,
    width: Number,
    // width: CustomPropTypes.nonNegative

    interpolation: {
      type: String,
      default: 'linear'
    },
    // interpolation: PropTypes.oneOf([
    //   "basis", "bundle", "cardinal", "catmullRom", "linear", "monotoneX",
    //   "monotoneY", "natural", "radial", "step", "stepAfter", "stepBefore"
    // ]),
    label: String
    // label: CustomPropTypes.deprecated(
    //   PropTypes.string,
    //   "Use `labels` instead for individual data labels"
    // )
  },

  // static propTypes = {
  //   ...BaseProps,
  //   ...DataProps,
  //   interpolation: PropTypes.oneOf([
  //     "basis", "bundle", "cardinal", "catmullRom", "linear", "monotoneX",
  //     "monotoneY", "natural", "radial", "step", "stepAfter", "stepBefore"
  //   ]),
  //   label: CustomPropTypes.deprecated(
  //     PropTypes.string,
  //     "Use `labels` instead for individual data labels"
  //   )
  // };

  // static defaultProps = {
  //   samples: 50,
  //   scale: "linear",
  //   standalone: true,
  //   sortKey: "x",
  //   dataComponent: <Curve/>,
  //   labelComponent: <VictoryLabel renderInPortal/>,
  //   containerComponent: <VictoryContainer/>,
  //   groupComponent: <VictoryClipContainer/>,
  //   theme: VictoryTheme.grayscale
  // };
  computed: {
    getDomain: Domain.getDomain.bind(Domain),
    getData: Data.getData.bind(Data),
    getBaseProps: function () {
      return partialRight(LineHelpers.getBaseProps.bind(LineHelpers), fallbackProps)
    },
    expectedComponents: function () {
      return ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
    },
    role: function () {
      return 'line'
    },
    continuous: function () {
      return true
    }
  },
  // static getDomain = Domain.getDomain.bind(Domain);
  // static getData = Data.getData.bind(Data);

  // static getBaseProps = partialRight(LineHelpers.getBaseProps.bind(LineHelpers),
  //   fallbackProps);
  // expectedComponents: [
  //   "dataComponent", "labelComponent", "groupComponent", "containerComponent"
  // ];
  // static expectedComponents = [
  //   "dataComponent", "labelComponent", "groupComponent", "containerComponent"
  // ];

  // Overridden in native versions
  // shouldAnimate() {
  //   return !!this.props.animate;
  // }
  render: function(createElement) {

  }
  render() {
    const { role } = this.constructor;
    const props = Helpers.modifyProps(this.props, fallbackProps, role);
    if (this.shouldAnimate()) {
      return this.animateComponent(props, animationWhitelist);
    }
    const children = this.renderContinuousData(props);
    return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
  }
}
// export default addEvents(VictoryLine);
</script>
