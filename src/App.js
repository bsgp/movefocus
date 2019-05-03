import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

function repeat(t) {
  const elm = t;
  if (t > 1) {
    const arr = repeat(t - 1);
    arr.push(elm);
    return arr;
  } else {
    return [elm];
  }
}

const MATERIAL_PREFIX = "mat-";
const QTY_PREFIX = "qty-";
const CODEID_PREFIX = "id-";
const LOT_PREFIX = "lot-";

const label = [`오더`, `제품`, `작업량`, `원료코드`, `동종재고`];
const inputs_header = [
  {
    id: "order",
    label: "오더"
  },
  {
    id: "product",
    label: "제품",
    asText: true
  },
  {
    id: "outputQuantity",
    label: "작업량",
    asText: true
  }
];
const inputs_item = [
  {
    id: "inputMaterial",
    label: "원료"
  },
  {
    id: "inputLot",
    label: "Lot"
  },
  {
    id: "inputQuantity",
    label: "",
    placeholder: "무게"
  }
];
const btn_group = [
  {
    id: "reWeighing",
    label: "재칭량"
  },
  {
    id: "splitLot",
    label: "Lot 분할"
  }
];

class App extends Component {
  state = {
    in_materials: repeat(15).map(t => ({
      id: `Material-${t}`,
      text: `Material text ${t}`,
      itemNumber: t,
      qty: ""
    })),
    run_timer: false
  };
  inputs = [];

  componentDidMount = () => {
    this.inputs = this.collectInputsIDs();
    this.focusNext();
  };
  componentDidUpdate = () => {
    //this.focusNext();
  };

  collectInputsIDs = () => {
    const { in_materials } = this.state;
    return in_materials.reduce((result, m) => {
      result.push(MATERIAL_PREFIX + m.id);
      result.push(QTY_PREFIX + m.id);
      return result;
    }, []);
  };

  focusNext = () => {
    this.inputs.every(id => {
      const input = document.getElementById(id);
      if (!input.value || input.value === "0") {
        input.focus();
        input.select();
        return false;
      }

      return true;
    });
  };

  setTimer = (input, target_material_id) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.setState({ run_timer: false });
    }
    this.setState({ run_timer: true });
    this.timer = setTimeout(() => {
      this.focusNext();
      this.setState({ run_timer: false });
    }, 2000);
  };

  anyOnChange = e => {
    e.preventDefault();
    const target_material_id = e.target.getAttribute("data-mat-id");
    const target_value = e.target.value;
    this.setTimer(e.target, target_material_id);
    return { target_material_id, target_value };
  };

  matOnChange = e => {
    this.anyOnChange(e);
  };

  qtyOnChange = e => {
    const { target_material_id, target_value } = this.anyOnChange(e);

    const { in_materials } = this.state;

    this.setState({
      in_materials: in_materials.map(m => {
        return m.id === target_material_id
          ? {
              ...m,
              qty: target_value
            }
          : { ...m };
      })
    });
  };

  render() {
    const { in_materials, run_timer } = this.state;
    const activeID = this.inputs.find(id => {
      return document.getElementById(id) === document.activeElement;
    });
    return (
      <div className="App">
        <header>
          <p>Order 102</p>
        </header>
        <section>
          <div className="">
            <p />
            <p />
          </div>
          <form>
            <div className="active-container">
              <div className="vbox inputs-header">
                {inputs_header.map((d, i) => (
                  <Input
                    id={`${d.id}-text`}
                    label={d.label}
                    asText={d.asText}
                    value={""}
                    placeholder={d.label}
                  />
                ))}
              </div>
              <div className="vbox inputs-item">
                {inputs_item.map((d, i) => (
                  <Input
                    id={`${d.id}-text`}
                    label={d.label}
                    asText={d.asText}
                    value={""}
                    placeholder={d.placeholder || d.label}
                  />
                ))}
              </div>

              <div className="vbox buttonGroup">
                {btn_group.map(b => (
                  <button key={b.id}>{b.label}</button>
                ))}
              </div>
            </div>
            <div className="inside-container">
              {in_materials.map(m => {
                const matID = `${MATERIAL_PREFIX}${m.id}`;
                const qtyID = `${QTY_PREFIX}${m.id}`;
                const data_attributes = {
                  "data-mat-id": m.id
                };
                return (
                  <div className="item-container" key={m.id}>
                    <div className="hbox-container">
                      <Input
                        id={`${m.id}-text`}
                        label={"Material Code - Text"}
                        asText={true}
                        value={`${m.id}-${m.text}`}
                      />
                    </div>
                    <div className="hbox-container">
                      <Input
                        label={"원료"}
                        run_timer={run_timer}
                        activeID={activeID}
                        id={matID}
                        placeholder={"원료"}
                        data_attributes={data_attributes}
                        onChange={this.matOnChange}
                        run_timer={false}
                        asText={true}
                      />
                      <Input
                        label={"실수량"}
                        run_timer={run_timer}
                        activeID={activeID}
                        id={qtyID}
                        placeholder={"실수량"}
                        data_attributes={data_attributes}
                        onChange={this.qtyOnChange}
                        type={"number"}
                        value={m.qty}
                        run_timer={false}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </form>
        </section>
        <footer>
          <p>Copyright © 2018 BSG PARTNERS Co,, Ltd.</p>
        </footer>
      </div>
    );
  }
}

class Input extends Component {
  render() {
    const {
      type,
      run_timer,
      activeID,
      id,
      value,
      label,
      data_attributes,
      onChange,
      asText,
      has_info,
      placeholder
    } = this.props;

    return (
      <div className="input-container">
        <div className="line">
          {label && (
            <label className={asText && "no_timer"} htmlFor={id}>
              {label}:
            </label>
          )}
          {run_timer && activeID && activeID === id && (
            <Timer label={label} has_info={has_info} />
          )}
        </div>
        <div className="line">
          <input
            type={type}
            placeholder={placeholder}
            {...data_attributes}
            //data-mat-id={m.id}
            {...asText && {
              readOnly: "readonly",
              disabled: "disabled"
            }}
            name={id}
            id={id}
            onChange={onChange}
            value={value}
          />
          {has_info && <span className="btn-info">i</span>}
        </div>
      </div>
    );
  }
}
class Timer extends Component {
  state = {
    p: 0
  };
  componentDidMount() {
    this.timer = setInterval(() => {
      const { p } = this.state;
      if (p === 100) {
        clearInterval(this.timer);
        return;
      }
      this.setState({ p: p + 5 });
    }, 100);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.p === prevState.p && this.state.p > 0) {
      this.setState({ p: 0 });
    }
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  render() {
    const { label, has_info } = this.props;
    return (
      <p
        className={`timer ${label ? "" : "no_label"} ${
          has_info ? "" : "no_info"
        }`}
        style={{ "--p": `${this.state.p}%` }}
      >
        -
      </p>
    );
  }
}

export default App;
