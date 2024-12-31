import { Option } from "../../../../../components/TailwindControls/Form/MultipleValuesLookupBox/MultipleValuesLookupBoxProps";

export default function staticLookupMapper<T>(
  lookupValues: Record<string, string>
) {
  return lookupValues
    ? Object.keys(lookupValues).map((key) => {
        return { value: key, label: lookupValues[key] };
      })
    : [];
}

export function lookupMapper(lookupOptions: Option<string | null>[]) {
  return lookupOptions
    ? lookupOptions
        ?.slice()
        ?.sort((optionOne, optionTwo) =>
          (optionOne?.order ?? NaN) > (optionTwo?.order ?? NaN) ? 1 : -1
        )
        ?.map((lookupOption) => {
          return {
            value: lookupOption?.newRecord
              ? lookupOption.id
              : lookupOption.value ?? lookupOption.id,
            label: lookupOption.label.en,
            visible: lookupOption.recordStatus
              ? lookupOption.recordStatus === "a"
              : lookupOption?.visible,
            colourHex: lookupOption.colourHex,
            defaultOption: lookupOption.defaultOption,
          };
        })
    : [];
}

export function stringLookupMapper<T>(options: {
  lookupOptions: { key: string; label: string }[];
}) {
  if (!options?.lookupOptions) {
    return [];
  }
  return Array.isArray(options.lookupOptions)
    ? options.lookupOptions?.map((lookupOption) => {
        return { value: lookupOption.key, label: lookupOption.label };
      })
    : [];
}
