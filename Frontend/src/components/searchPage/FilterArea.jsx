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
    { key: 4, label: 'Programming', type: 'skill' },
    { key: 5, label: 'Vancouver', type: 'location' },
    { key: 6, label: 'Water Waste Management', type: 'skill' },
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
      <div className={classes.skillsBox}>
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
    skillsBox: {
        margin: "10px",
        border: "1px solid #8A8989",
        borderRadius: "10px",
        display: "flex",
        minHeight: "42px",
        justifyContent: "left",
        flexWrap: 'wrap',
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