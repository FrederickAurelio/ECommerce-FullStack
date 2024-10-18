import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useFilter } from "./UseFilter";

function ProductFilter() {
  const { checkFilter, setCheckFilter } = useFilter();
  const handleCheckboxChange = (keyItem, optionId) => {
    setCheckFilter((prevFilters) => {
      const isChecked = prevFilters[keyItem].includes(optionId);
      if (isChecked) {
        return {
          ...prevFilters,
          [keyItem]: prevFilters[keyItem].filter((id) => id !== optionId),
        };
      } else {
        return {
          ...prevFilters,
          [keyItem]: [...prevFilters[keyItem], optionId],
        };
      }
    });
  };

  return (
    <div className="rounded-lg bg-background shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="space-y-4 p-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="mt-2 grid gap-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex items-center gap-2 font-medium"
                  >
                    <Checkbox
                      checked={checkFilter[keyItem].includes(option.id)}
                      onCheckedChange={() =>
                        handleCheckboxChange(keyItem, option.id)
                      }
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
