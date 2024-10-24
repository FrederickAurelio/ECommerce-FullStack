import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  children,
  isLoading,
  isBtnDisabled,
}) {
  function renderInputByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] ?? "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            disabled={isLoading}
            required
            placeholder={getControlItem.placeholder}
            name={getControlItem.name}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) =>
              setFormData((data) => {
                return { ...data, [getControlItem.name]: e.target.value };
              })
            }
          />
        );
        break;
      case "select":
        element = (
          <Select
            disabled={isLoading}
            required
            onValueChange={(value) =>
              setFormData((data) => {
                return {
                  ...data,
                  [getControlItem.name]: value,
                };
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : ""}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            disabled={isLoading}
            required
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(e) =>
              setFormData((data) => {
                return { ...data, [getControlItem.name]: e.target.value };
              })
            }
          />
        );
        break;
      default:
        element = (
          <Input
            disabled={isLoading}
            required
            placeholder={getControlItem.placeholder}
            name={getControlItem.name}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) =>
              setFormData((data) => {
                return { ...data, [getControlItem.name]: e.target.value };
              })
            }
          />
        );
        break;
    }
    return element;
  }
  return (
    <form onSubmit={onSubmit}>
      {children}
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <label className="mb-1">{controlItem.label}</label>
            {renderInputByComponentType(controlItem)}
          </div>
        ))}
        <Button
          disabled={isLoading || isBtnDisabled}
          type="submit"
          className="mt-2 w-full disabled:bg-muted-foreground"
        >
          {buttonText || "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
