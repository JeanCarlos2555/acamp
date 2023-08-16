function toastErro(erro) {
    $('.toast-erro').text(erro)
    const toastLiveExample = $('#liveToastErro')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample[0], {
        autohide: true
    })
    toastBootstrap.show()
}

function toastMsm(msm) {
    $('.toast-msm').text(msm)
    const toastLiveExample = $('#liveToastMsm')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample[0], {
        autohide: true
    })
    toastBootstrap.show()
}