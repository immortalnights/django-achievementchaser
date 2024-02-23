import {
    SelectChangeEvent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material"

const PlayerSelect = ({
    options,
    value,
    onChange,
}: {
    options: { id: string; name?: string }[]
    value?: string
    onChange: (value: string) => void
}) => {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value)
    }

    return (
        <FormControl
            sx={{ minWidth: 200 }}
            size="small"
            disabled={options.length === 0}
        >
            <InputLabel id="select-player-compare-label">Compare</InputLabel>
            <Select
                labelId="select-player-compare-label"
                fullWidth
                value={value ?? ""}
                label="Compare"
                size="small"
                onChange={handleChange}
            >
                {value && (
                    <MenuItem key="noone" value="">
                        No one
                    </MenuItem>
                )}
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option.name ?? option.id}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
export default PlayerSelect
