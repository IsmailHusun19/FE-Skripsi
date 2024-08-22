import Navbar from '../component/Navbar'
import HomeSatu from '../assets/HomeSatu.svg'
import HomeDua from '../assets/HomeDua.svg'
import HomeTiga from '../assets/HomeTiga.svg'
import HomeEmpat from '../assets/HomeEmpat.svg'
import Unbaja from '../assets/unbaja.jpg'

const Home = () => {
    return (
        <div className='container-satu'>
            <Navbar/>
            <div className='box-landingpage-satu'>
                <div className='box-landingpage-satu-content'>
                    <h1>Selamat Datang di E - Learning  Universitas Banten Jaya - Solusi Belajar Online Terdepan</h1>
                    <p>Kami menyediakan pengalaman belajar yang interaktif, dan mudah diakses kapan saja dan di mana saja. Learning Universitas Banten Jaya hadir untuk mendukung perjalanan pendidikan Anda menuju masa depan yang lebih baik. </p>
                    <button type="button">Mulai Belajar Sekarang!</button>
                </div>
                <div className='box-landingpage-satu-gambar'><img src={HomeSatu}/></div>
            </div>
            <div className='box-landingpage-dua'>
                <div className='box-landingpage-dua-content'>
                    <p>Platform e-learning ini memungkinkan Anda belajar kapan saja dan di mana saja. Anda tidak lagi terbatas oleh lokasi atau waktu, sehingga dapat mengatur jadwal belajar sesuai dengan kesibukan dan ritme Anda sendiri. Hal ini sangat membantu bagi mahasiswa di kelas non-reguler atau kelas malam, karena Anda dapat mengikuti materi dan tugas tanpa khawatir tertinggal, meskipun memiliki jadwal yang padat atau bekerja di siang hari. Dengan demikian, platform ini memberikan solusi yang optimal bagi mereka yang memiliki komitmen lain di luar jam belajar tradisional, sehingga pendidikan tetap dapat diakses tanpa hambatan waktu.</p>
                    <img src={HomeDua}/>
                </div>
                <div className='box-landingpage-dua-content reverse'>
                    <p>Platform ini dirancang untuk mendukung pembelajaran tatap muka. Mahasiswa dapat memanfaatkan materi yang tersedia untuk mengikuti atau mempersiapkan diri sebelum kelas, serta untuk memastikan mereka tidak ketinggalan jika ada materi yang sulit dipahami saat sesi tatap muka. Selain itu, dengan akses yang konsisten ke materi ini, mahasiswa dapat lebih aktif berpartisipasi dalam diskusi di kelas dan datang dengan pertanyaan yang lebih mendalam, sehingga proses belajar mengajar menjadi lebih interaktif dan bermakna. Ini juga memungkinkan dosen untuk mengidentifikasi area yang memerlukan perhatian lebih dan memberikan penjelasan tambahan sesuai kebutuhan mahasiswa.</p>
                    <img src={HomeTiga}/>
                </div>
                <div className='box-landingpage-dua-content nonReverse'>
                    <p>Jika mahasiswa merasa ada materi yang perlu diulang atau diperjelas, mereka dapat dengan mudah mengakses kembali materi tersebut di platform ini kapan saja, tanpa harus menunggu penjelasan ulang dari dosen di kelas. Hal ini tidak hanya membantu mahasiswa yang mungkin kesulitan memahami topik tertentu, tetapi juga memberikan fleksibilitas bagi mereka untuk belajar sesuai dengan kecepatan masing-masing. Dengan akses yang tidak terbatas ini, mahasiswa dapat lebih percaya diri dalam memahami seluruh materi, dan lebih siap menghadapi ujian atau tugas yang diberikan. </p>
                    <img src={HomeEmpat}/>
                </div>
            </div>
            <svg className='gelombangCss' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="0.2" d="M0,224L60,224C120,224,240,224,360,208C480,192,600,160,720,165.3C840,171,960,213,1080,213.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
            <div className='box-landingpage-tiga'>
                <div className='box-landingpage-tiga-content'>
                    <div className='test'></div>
                    <img src={Unbaja} alt=""/>
                    <div>
                        <h1>Riwayat Singkat Universitas Banten Jaya</h1>
                        <p>Proses pembentukan atau pendirian sebuah Perguruan Tinggi tidaklah semudah apa yang diperkirakan, karena pembentukan lembaga seperti ini memerlukan perhitungan yang matang serta studi intensif mengenai berbagai aspek kemampuan, peluang, tantangan, dan kendala-kendala yang mungkin terjadi baik pada saat pendirian maupun saat proses penyelenggaraan pendirian berlangsung. Selain itu, pendirian perguruan tinggi juga membutuhkan komitmen jangka panjang untuk memastikan bahwa visi dan misi institusi tersebut dapat tercapai, termasuk kesiapan dalam hal sumber daya manusia, infrastruktur, dan tata kelola yang baik.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;