package slct.contratacionmodificacion.pgs.view;

import com.isb.pgs.taglibs.annotations.PegasusBean;
import com.isb.pgs.PegasusCloneable;


@PegasusBean
public final class MainBean implements PegasusCloneable {
	
	private Boolean rendered;
	
	public MainBean ( ) {
		this.rendered = true;
	}
	
	public Boolean getRendered ( ) {
	    return this.rendered;
	}
	public void setRendered ( Boolean rendered ) {
	   this.rendered = rendered;
	}
	@Override
	public Object clone ( ) throws CloneNotSupportedException {
		MainBean bean_clone =  (MainBean) super.clone( );
		return bean_clone;
	}
}
