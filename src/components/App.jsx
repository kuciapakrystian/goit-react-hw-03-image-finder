import 'react-toastify/dist/ReactToastify.css';
import { Component } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import { ImageErrorView } from './ImageErrorView/ImageErrorView';
import { imgApi } from 'service/imgApi';

export class App extends Component {
  state = {
    textQuery: '',
    images: [],
    page: 1,
    loading: false, // spiner
    showModal: false,
    error: null,
    totalPage: null,
  };

  async componentDidUpdate(_, prevState) {
    let { page } = this.state;
    const prevSearchValue = prevState.textQuery;
    const nextSearchValue = this.state.textQuery;

    if (prevSearchValue !== nextSearchValue) {
      this.setState({ page: 1, images: [] });
    }

    
    if (prevSearchValue !== nextSearchValue || prevState.page !== page) {
      
      this.setState({ loading: true, error: null });

      
      try {
        const response = await imgApi(nextSearchValue, page);
        const { hits, totalHits } = response.data;
        this.setState(prevState => ({
          images: page === 1 ? hits : [...prevState.images, ...hits],
          totalPage: totalHits,
        }));
      } catch (error) {
        this.setState({ error: 'Something wrong. Please try again.' });
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  
  handleSubmit = searchValue => {
    this.setState({ textQuery: searchValue, page: 1 });
  };

  
  onLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  
  onOpenModal = (imgUrl, tag) => {
    this.setState({ showModal: true, imgUrl, tag });
  };

  
  onCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { images, showModal, imgUrl, tag, loading, totalPage, error, page } =
      this.state;
    return (
      <>
        <Searchbar onSubmit={this.handleSubmit} />

        <ImageGallery images={images} openModal={this.onOpenModal} />

        
        {showModal && (
          <Modal onClose={this.onCloseModal}>
            <img src={imgUrl} alt={tag} />
          </Modal>
        )}

        
        <Loader isLoading={loading} />

        
        {totalPage / 12 > page && <Button loadMore={this.onLoadMore} />}

        
        {totalPage === 0 && <ImageErrorView />}

        
        {error && <ImageErrorView>{error}</ImageErrorView>}
      </>
    );
  }
}