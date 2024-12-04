import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { useState, useCallback, memo } from 'react';
import { Wcldata, Wcldatafilter } from '../Models.tsx';
import { Draggable, Droppable, DragDropContext } from '@hello-pangea/dnd';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    maxWidth: '100%',
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const grid = 4;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
    userSelect: "none",
    padding: grid,
    boderRadius: grid,
    background: isDragging ? "lightgreen" : "transparent",
    ...draggableStyle
});

const getListStyle = (isDraggingOver: any) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: 0,
    width: '100%',
    borderRadius: grid,
});

const FilterChip = memo(({ item, onFilterClick }: any) => {
    return (
        <Chip
            avatar={<Avatar src={item.imgUrl} />}
            label={item.abilityId}
            variant="outlined"
                onClick={() => onFilterClick(item)} />
    )
});
export default function WclScrape() {
    const [isLoading, setLoading] = useState(false)
    const [inputUrl, setInputUrl] = useState('')
    const [nextKey, setNextKey] = useState(0)
    const [wcldata, setWcldata] = useState<Wcldata[]>([])
    const [wcldatafilter, setWcldatafilter] = useState<Wcldatafilter[]>([])
    //const [filteredWcldata, setFilteredWcldata] = useState<Wcldata[]>([])

    const handleInputChange = (event: any) => {
        setInputUrl(event.target.value);
    };

    const onClickHandler = async () => {
        setLoading(true)
        // const url = "https://www.warcraftlogs.com/reports/QrXtDRxGmAdWL724#fight=7&type=casts&source=21&view=events&translate=true";
        console.log(inputUrl);
        const response = await fetch('wclscrape/?url=' + encodeURIComponent(inputUrl), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            },
        });
        console.log(response)
        if (response.status == 200) {
            const result = await response.json();
            setWcldata(result);
            setNextKey(result.length);

            const resultFilter: Wcldatafilter[] = result.reduce((accumulator: Wcldatafilter[], current: Wcldata) => {
                if (!accumulator.find((item: Wcldatafilter) => item.abilityId === current.abilityId)) {
                    accumulator.push({ abilityId: current.abilityId, imgUrl: current.imgUrl });
                }
                return accumulator;
            }, []);

            setWcldatafilter(resultFilter);
        }
        setLoading(false)
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        const newWcldata = Array.from(wcldata);
        const [removed] = newWcldata.splice(result.source.index, 1);
        newWcldata.splice(result.destination.index, 0, removed);

        setWcldata(newWcldata);
    };

    const onFilterClick = useCallback((item: Wcldatafilter) => {
        setWcldatafilter(prevItems => prevItems.filter(prevItem => prevItem.abilityId !== item.abilityId));
        setWcldata(prevItems => prevItems.filter(prevItem => prevItem.abilityId !== item.abilityId));
    }, []);

    const onClickClear = (index: number) => {
        setWcldata(prevItems => prevItems.filter((_, i) => i !== index));
    };

    const onClickDuplicate = (index: number, item: Wcldata) => {
        const newItem = { ...item, key: nextKey }
        const newWcldata = Array.from(wcldata);
        newWcldata.splice(index + 1, 0, newItem);
        setNextKey(prev => prev + 1);
        setWcldata(newWcldata);
    };

    const onTimeChange = (index: number, value: number) => {
        setWcldata((prevItems) =>
            prevItems.map((item, i) => {
                return index !== i ? item : { ...item, time: value };
            })
        );
    };

    const timeToTimeString = (time: number) => {
        const minutes = Math.floor(time / 60).toString();
        const seconds = (time % 60).toString();

        const minuteString = minutes.length > 1 ? minutes : "0" + minutes;
        const secondString = seconds.length > 1 ? seconds : "0" + seconds;

        return minuteString + ":" + secondString;
    };

    const onCopyClicked = () => {
        const content = wcldata.reduce((accumulator: string, current: Wcldata) => {
            return accumulator + "{time:" + timeToTimeString(current.time) + "} - " + "{spell:" + current.abilityId + "} " + "\n";
        }, "");
        navigator.clipboard.writeText(content)
        alert("copied")
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
                <Item>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={10}>
                            <div>
                                <TextField fullWidth label="fullWidth" id="fullWidth" value={inputUrl} onChange={handleInputChange} />
                            </div>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <div>
                                <Button variant="contained" size="large" endIcon={<SendIcon />}
                                    disabled={isLoading} onClick={() => onClickHandler()}>
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Item>

                <div>
                    <Button variant="contained" size="large" endIcon={<ContentCopyIcon />}
                        onClick={() => onCopyClicked()}>
                    </Button>
                </div>

                {isLoading && (
                    <p><em>Loading...</em></p>
                )}

                {wcldatafilter &&
                    <Box sx={{ width: '100%' }}>
                        {wcldatafilter.map((item, index) => (
                            <FilterChip
                                key={index}
                                item={item}
                                onFilterClick={onFilterClick}
                            />
                        ))}
                    </Box>
                }

                {wcldata &&
                    <Item>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided: any, snapshot: any) => (
                                    <List
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {wcldata.map((item, index) => (
                                            <Draggable key={'item-' + item.key} draggableId={'item-' + item.key} index={index}>
                                                {(provided: any, snapshot: any) => (
                                                    <ListItem
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}
                                                    >
                                                        <Item>

                                                            <span>
                                                                <img src={item.imgUrl} width="22px" />
                                                                <TextField
                                                                    type="number"
                                                                    InputLabelProps={{
                                                                        shrink: true,
                                                                    }}
                                                                    defaultValue={item.time}
                                                                    size="small"
                                                                    sx={{ '& .MuiOutlinedInput-input': { padding: '0 5px' }, width: 50 }}
                                                                    onBlur={e => onTimeChange(index, parseInt(e.target.value))}
                                                                />
                                                                {timeToTimeString(item.time) + " "}
                                                                {item.abilityId + " "}
                                                                {item.abilityName}
                                                            </span>

                                                            <IconButton aria-label="delete" size="small" sx={{ padding: 0 }}
                                                                onClick={() => onClickDuplicate(index, item)}>
                                                                <LibraryAddIcon />
                                                            </IconButton>
                                                            <IconButton aria-label="delete" size="small" sx={{padding: 0}}
                                                                onClick={() => onClickClear(index)}>
                                                                <ClearIcon />
                                                            </IconButton>
                                                        </Item>
                                                    </ListItem>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </List>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Item>
                }

            </Stack>
        </Box>
    );

}

