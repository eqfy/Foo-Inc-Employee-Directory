import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomCheckBox from "../common/CustomCheckbox";
import Dropdown from "../common/Dropdown"
import Chip from '@material-ui/core/Chip';


export default function FilterArea() {
const classes = useStyles();
// TODO: Fetch from redux store
const [chipData, setChipData] = React.useState([
    { key: 0, label: 'BC', type: 'location' },
    { key: 1, label: 'Programming', type: 'skill' },
    { key: 2, label: 'Program Management', type: 'skill' },
    { key: 3, label: 'Capital', type: 'skill' },
  ]);

  const handleDelete = (chipToDelete) => () => {
    // TODO: Update redux store
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <div className={classes.filterArea}>
      <div className={classes.sortingArea}>
     <Dropdown values={["all", "employees","contractors"]} label="show"/>
     <Dropdown values={["name", "title"]} label="sort by"/>
     <CustomCheckBox name="sortAsc" label="Ascending"/>
      </div>
      <div className={classes.skills}>
      {chipData.map((data) => {
        return (
          <li key={data.key} className={classes.chipItem}>
            <Chip
              label={data.label}
              onDelete={handleDelete(data)}
              className={classes.chip}
              style={{background: data.type === 'location'? '#00D1FF': '#FF9900'}}
            />
          </li>
        );
      })}</div>
    </div>
  );
}

const useStyles = makeStyles(() => ({
    filterArea: {
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    skills: {
        margin: "10px",
        border: "1px solid black",
        borderRadius: "10px",
        display: "flex",
        minHeight: "42px"
      },
    sortingArea: {
        display: "flex",
        margin: "10px"
    },
    chipItem: {
        listStyle: "none"
    },
    chip: {
        margin: "5px",
        background: "orange"
    }
  }));