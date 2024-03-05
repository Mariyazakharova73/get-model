import { ChangeEvent, FormEvent, memo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';
import s from './index.module.css';
// test

const inputsData = [
  { name: 'title', label: 'Параметр' },
  { name: 'textValue', label: 'Значение' },
];

interface Param {
  id: IdType;
  name: string;
}
interface ParamValue {
  paramId: IdType;
  value: string;
}
interface Model {
  paramValues: ParamValue[];
}

type IdType = number | string;

const App = () => {
  const [params, setParams] = useState<Param[]>([
    {
      id: 1,
      name: 'Назначение',
    },
    {
      id: 2,
      name: 'Длина',
    },
  ]);

  const [model, setModel] = useState<Model>({
    paramValues: [
      {
        paramId: 1,
        value: 'повседневное',
      },
      {
        paramId: 2,
        value: 'макси',
      },
    ],
  });

  const editParamValue = (id: IdType, newValue?: string) => {
    const newArr = model.paramValues.map(item => {
      if (item.paramId === id) {
        return { ...item, value: newValue || '' };
      }
      return item;
    });
    setModel({ ...model, paramValues: newArr });
  };

  const deleteParamValue = (id: IdType) => {
    const newArr = model.paramValues.filter(item => item.paramId !== id);
    setModel({ ...model, paramValues: newArr });
    const newParamsArr = params.filter(item => item.id !== id);
    setParams(newParamsArr);
  };

  const addNewParam = (paramName: string, paramValue: string) => {
    const newId = uuidv4();
    setModel({
      ...model,
      paramValues: [...model.paramValues, { paramId: newId, value: paramValue }],
    });
    setParams([...params, { id: newId, name: paramName }]);
  };

  return (
    <main className={s.app}>
      <div className={s.paramsList}>
        {params.map(item => {
          return (
            <ParamComponent
              item={item}
              model={model}
              key={item.id}
              editParamValue={editParamValue}
              deleteParamValue={deleteParamValue}
            />
          );
        })}
        {params.length === 0 && <p>Добавьте новые параметры</p>}
      </div>
      <NewParamForm addNewParam={addNewParam} />
    </main>
  );
};

interface ParamComponentProps {
  item: Param;
  model: Model;
  editParamValue: (id: IdType, value?: string) => void;
  deleteParamValue: (id: IdType) => void;
}

const ParamComponent = memo(({
  item,
  model,
  editParamValue,
  deleteParamValue,
}: ParamComponentProps) => {
  const obj = model.paramValues.find(i => {
    return i.paramId === item.id;
  });

  const [paramValue, setParamValue] = useState(obj?.value);

  const [editMode, setEditMode] = useState(false);

  const onClickEdit = () => {
    setEditMode(true);
  };

  const onClickCancel = () => {
    setEditMode(false);
    setParamValue(obj?.value);
  };

  const handleParamValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setParamValue(e.target.value);
  };

  const handleBlur = () => {
    setEditMode(false);
    editParamValue(item.id, paramValue);
  };

  const handleDeleteParamClick = () => {
    deleteParamValue(item.id);
  };

  return (
    <div className={s.inputRow}>
      <label className={s.label}>{item.name}</label>
      {editMode ? (
        <>
          <input
            type="text"
            value={paramValue}
            autoFocus
            onChange={handleParamValueChange}
            onBlur={handleBlur}
          />
          <button
            className={s.buttonEdit}
            onMouseDown={e => e.preventDefault()}
            onClick={onClickCancel}
          >
            Отменить
          </button>
        </>
      ) : (
        <>
          <p className={s.inputValue}>{obj?.value}</p>
          <button
            className={s.buttonEdit}
            onMouseDown={e => e.preventDefault()}
            onClick={onClickEdit}
          >
            Редактировать
          </button>
        </>
      )}
      <button className={s.buttonDelete} onClick={handleDeleteParamClick}>
        Удалить
      </button>
    </div>
  );
});

interface NewParamFormProps {
  addNewParam: (paramName: string, paramValue: string) => void;
}

const NewParamForm = ({ addNewParam }: NewParamFormProps) => {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    setValues({ ...values, [name]: value });
  };

  const resetForm = () => {
    setValues({});
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNewParam(values.title, values.textValue);
    resetForm();
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <p className={s.formTitle}>Добавить новый параметр</p>
      {inputsData.map(inputData => {
        return (
          <div className={s.inputRow} key={inputData.name}>
            <label className={s.label}>{inputData.label}</label>
            <input
              name={inputData.name}
              className={s.formInput}
              type="text"
              onChange={handleChange}
              value={values[inputData.name] || ''}
            />
          </div>
        );
      })}
      <button
        className={s.buttonSave}
        type="submit"
        disabled={!(!!values.title && !!values.textValue)}
      >
        Добавить
      </button>
    </form>
  );
};

// interface InputRowProps {

// }

// const InputRow = memo(({ inputName, handleChange, inputData }: InputRowProps) => {
//   return (
//     <div className={s.inputRow}>
//       <label className={s.label}>{inputData.label}</label>
//       <input
//         name={inputData.name}
//         className={s.formInput}
//         type="text"
//         onChange={handleChange}
//         value={inputName || ''}
//       />
//     </div>
//   );
// });

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
