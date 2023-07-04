<template>
    <div>
        <button onclick="noticeModal.showModal()">
            <font-awesome-icon icon="fa-solid fa-question" for="noticeModal" class="text-sky-400"/>
        </button>
        <dialog id="noticeModal" class="modal">
        <form method="dialog" class="modal-box text-base font-normal text-left">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            <h3 class="text-2xl font-bold text-center mb-2">常见问答</h3>
			<div class="collapse border border-base-300 rounded-2xl mb-2">
				<input type="checkbox" />
				<div class="collapse-title text-lg font-medium">
					怎样分享素材给站长呢？
				</div>
				<div class="collapse-content font-normal">
					<p>欢迎直接<a href="mailto: jeep.jipu@gmail.com">邮箱联系</a>站长。</p>
					<p>关于素材，核心要求是搞笑。毕竟访客是来寻开心的，不是受教育的～</p>
				</div>
			</div>
        </form>
        </dialog>
    </div>
</template>