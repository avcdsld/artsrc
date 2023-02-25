import { useState, useEffect, useRef } from 'react';
import { useWallet } from 'hooks/useWallet';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';
import Alert from '@mui/material/Alert';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import FileInputComponent from 'react-file-input-previews-base64';
import { NFTStorage, File } from 'nft.storage';
import { createSourceNFT, updateSourceNFT } from 'utils/flow';
import { notifyTx } from 'utils/notifications';
import CreationSuccessDialog from './CreationSuccessDialog';
import { nftStorageApiKey } from 'config';
import useSource from 'hooks/useSource';
import Loading from './Loading';

const defaultCode = `\
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
}

function draw() {
  circle(mouseX, mouseY, 20);
}
`;

interface Props {
  editMode?: boolean | null;
  ownerAddress?: string | null;
  sourceId?: string | null;
}

const Create = ({ editMode, ownerAddress, sourceId }: Props) => {
  const { isActive, account } = useWallet();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [artType, setArtType] = useState('p5js');
  const [code, setCode] = useState(defaultCode);
  const [isOpenSaveForm, setIsOpenSaveForm] = useState(false);
  const [codeTitle, setCodeTitle] = useState('');
  const [codeDescription, setCodeDescription] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [codeImageIpfsCid, setCodeImageIpfsCid] = useState('');
  const [pending, setPending] = useState(false);
  const [createdSourceId, setCreatedSourceId] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const { loading, error, data } = useSource({
    ownerAddress: ownerAddress || '',
    sourceId: sourceId || '',
  });

  const run = () => {
    const html = `\
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<!-- keep the line below for OpenProcessing compatibility -->
<script src="https://openprocessing.org/openprocessing_sketch.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/p5.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.5.0/addons/p5.sound.min.js"></script>
<script>
${code}
</script>
<style>
html,
body {
	margin: 0;
	padding: 0;
}
main {
  width: 100%;
}
</style>
</head>
<body></body>
</html>`;
    iframeRef.current!.srcdoc = html;
  };

  const reset = () => {
    const html = '<html></html>';
    iframeRef.current!.srcdoc = html;
  };

  const storeNFT = async (file: File) => {
    const nftstorage = new NFTStorage({ token: nftStorageApiKey });
    return nftstorage.storeBlob(file);
  };

  const processImageFile = async (file: any) => {
    try {
      setIsUploadingImage(true);
      const cid = await storeNFT(file.file);
      console.log(cid);
      setCodeImageIpfsCid(cid);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const create = async () => {
    const createAction = async () => {
      return await createSourceNFT({
        artType,
        code,
        title: codeTitle,
        description: codeDescription,
        imageIpfsCid: codeImageIpfsCid,
      });
    };
    notifyTx({
      method: createAction,
      success: 'Your code has been saved!',
      error: 'An error occured while trying to save.',
      onSuccess: (currentTransaction: any) => {
        console.log({ currentTransaction });
        setCreatedSourceId('111'); // TODO:
        setPending(false);
        setSuccessOpen(true);
      },
      onSubmitted: () => setPending(true),
      onError: () => setPending(false),
    });
    console.log({ codeTitle, codeDescription, codeImageIpfsCid });
  };

  const update = async () => {
    const updateAction = async () => {
      return await updateSourceNFT({
        artType,
        code,
        title: codeTitle,
        description: codeDescription,
        imageIpfsCid: codeImageIpfsCid,
      });
    };
    notifyTx({
      method: updateAction,
      success: 'Your code has been updated!',
      error: 'An error occured while trying to update.',
      onSuccess: (currentTransaction: any) => {
        console.log({ currentTransaction });
        setCreatedSourceId(sourceId!);
        setPending(false);
        setSuccessOpen(true);
      },
      onSubmitted: () => setPending(true),
      onError: () => setPending(false),
    });
  };

  useEffect(() => {
    if (data) {
      console.log({ data });
      setArtType(data.artType || 'p5js');
      setCode(data.code);
      setCodeTitle(data.title);
      setCodeDescription(data.description);
      setCodeImageIpfsCid(data.imageIpfsCid);
    }
  }, [data]);

  useEffect(() => {
    if (isActive && account?.addr === ownerAddress) {
      setCanEdit(true);
    }
  }, [isActive, account, ownerAddress]);

  return (
    <>
      {editMode && !data ? (
        <Alert severity='error'>Source not found</Alert>
      ) : loading ? (
        <Loading />
      ) : error ? (
        <Alert severity='error'>Error loading project</Alert>
      ) : (
        <Box>
          <FormControl
            variant='filled'
            fullWidth
            size='small'
            sx={{ marginBottom: 4 }}
          >
            <Select
              value={artType}
              onChange={(event: SelectChangeEvent) =>
                setArtType(event.target.value)
              }
              sx={{
                marginBottom: 0,
                lineHeight: '90%',
                height: '100%',
              }}
            >
              <MenuItem value={'p5js'}>p5.js</MenuItem>
              <MenuItem value={'cadence'}>Cadence contract</MenuItem>
            </Select>
          </FormControl>

          <Grid spacing={2} container>
            <Grid item md={6} sm={12} xs={12}>
              <Box sx={{ border: 1, borderColor: 'grey.400', minHeight: 480 }}>
                <AceEditor
                  mode='javascript'
                  theme='github'
                  value={code}
                  onChange={(value: string) => setCode(value)}
                  name='code'
                  width='100%'
                  highlightActiveLine={false}
                  wrapEnabled
                  fontSize={13}
                  maxLines={28}
                  setOptions={{
                    showLineNumbers: true,
                    fontFamily: "'DM Mono', monospace",
                  }}
                />
              </Box>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <Box sx={{ border: 1, borderColor: 'grey.400', height: 480 }}>
                <iframe
                  ref={iframeRef}
                  title='play'
                  srcDoc='<html></html>'
                  frameBorder={0}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  width='100%'
                  height='480'
                ></iframe>
              </Box>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <Button
                variant='outlined'
                endIcon={<PlayArrowIcon />}
                onClick={run}
                style={{ marginRight: 8 }}
              >
                Run
              </Button>
              <Button variant='outlined' onClick={reset}>
                Reset
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

          <Grid spacing={2} container sx={{ marginBottom: 4 }}>
            <Grid item md={12} sm={12} xs={12}>
              <Button
                variant='text'
                endIcon={<SaveIcon />}
                onClick={() => setIsOpenSaveForm(!isOpenSaveForm)}
                style={{ marginRight: 8 }}
              >
                {!isOpenSaveForm ? '▷' : '▽'}{' '}
                {!canEdit ? 'Save the Source Code' : 'Update the Source Code'}
              </Button>
            </Grid>

            {isOpenSaveForm && (
              <>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    id='outlined-helperText'
                    label='Title'
                    size='small'
                    sx={{ width: 400 }}
                    onChange={(event) => setCodeTitle(event.target.value)}
                    value={codeTitle}
                    // helperText='You can change it later'
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    id='outlined-helperText'
                    label='Description'
                    size='small'
                    multiline
                    rows={4}
                    sx={{ width: 400 }}
                    onChange={(event) => setCodeDescription(event.target.value)}
                    value={codeDescription}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <FileInputComponent
                    labelText=''
                    parentStyle={{}}
                    imagePreview={true}
                    multiple={false}
                    callbackFunction={processImageFile}
                    buttonComponent={
                      <LoadingButton
                        loading={isUploadingImage}
                        loadingPosition={'start'}
                        startIcon={<></>}
                        variant='outlined'
                        endIcon={isUploadingImage ? null : <ImageIcon />}
                        style={{
                          borderColor: '#bbb',
                          textTransform: 'none',
                          color: '#555',
                        }}
                      >
                        {isUploadingImage ? '　　Uploading..' : 'Image file'}
                      </LoadingButton>
                    }
                    accept='image/*'
                  />
                </Grid>

                {pending ? (
                  <Grid item md={12} sm={12} xs={12}>
                    <LoadingButton loading variant='contained'>
                      Creating
                    </LoadingButton>
                  </Grid>
                ) : (
                  <Grid item md={12} sm={12} xs={12}>
                    <Button
                      variant='contained'
                      endIcon={<SaveIcon />}
                      size='large'
                      onClick={() => {
                        if (canEdit) {
                          create();
                        } else {
                          update();
                        }
                      }}
                      style={{ marginTop: 8 }}
                      disabled={!codeImageIpfsCid}
                    >
                      {!canEdit ? 'Save' : 'Update'}
                    </Button>
                  </Grid>
                )}
                <CreationSuccessDialog
                  ownerAddress={isActive ? account!.addr : ''}
                  sourceId={createdSourceId}
                  open={successOpen}
                  editMode={editMode}
                  handleClose={() => {
                    setSuccessOpen(false);
                  }}
                />
              </>
            )}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Create;
